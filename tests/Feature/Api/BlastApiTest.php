<?php

namespace Tests\Feature\Api;

use App\Jobs\SendWhatsAppBlastJob;
use App\Models\BlastLog;
use App\Models\BlastLogItem;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BlastApiTest extends TestCase
{
    use DatabaseMigrations;

    public function test_owner_can_trigger_blast_job(): void
    {
        Queue::fake();
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner3@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'blast-slug',
            'is_published' => false,
            'content' => ['seo' => ['title' => 't']],
        ]);
        $guest = Guest::query()->create([
            'invitation_id' => $inv->id,
            'name' => 'Guest C',
            'phone_raw' => '08122',
            'phone_normalized' => '628122',
            'guest_key' => 'guest-c-8122',
            'send_status' => 'pending',
        ]);

        $response = $this->actingAs($user)->postJson('/api/invitations/'.$inv->id.'/blast', [
            'guest_ids' => [$guest->id],
            'mode' => 'selected',
        ]);

        $response->assertStatus(202);
        Queue::assertPushed(SendWhatsAppBlastJob::class);
    }

    public function test_owner_can_trigger_blast_by_mode(): void
    {
        Queue::fake();
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner6@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'blast-mode-slug',
            'is_published' => false,
            'content' => ['seo' => ['title' => 't']],
        ]);
        Guest::query()->create([
            'invitation_id' => $inv->id,
            'name' => 'Guest X',
            'phone_raw' => '08155',
            'phone_normalized' => '628155',
            'guest_key' => 'guest-x-8155',
            'send_status' => 'failed',
        ]);

        $response = $this->actingAs($user)->postJson('/api/invitations/'.$inv->id.'/blast/mode', [
            'mode' => 'retry_failed',
        ]);

        $response->assertStatus(202);
        Queue::assertPushed(SendWhatsAppBlastJob::class);
    }

    public function test_plan_limit_free_blocks_second_invitation(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner8@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);

        $this->actingAs($user)->postJson('/api/invitations', [
            'slug' => 'first-one',
            'content' => ['seo' => ['title' => 'first']],
            'is_published' => false,
        ])->assertCreated();

        $this->actingAs($user)->postJson('/api/invitations', [
            'slug' => 'second-one',
            'content' => ['seo' => ['title' => 'second']],
            'is_published' => false,
        ])->assertStatus(422);
    }

    public function test_blast_job_writes_log_items(): void
    {
        Http::fake([
            '*' => Http::response(['status' => true], 200),
        ]);

        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner11@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'blast-run-slug',
            'is_published' => true,
            'content' => ['couple' => ['joinedName' => 'A & B']],
        ]);
        $guest = Guest::query()->create([
            'invitation_id' => $inv->id,
            'name' => 'Guest Y',
            'phone_raw' => '08156',
            'phone_normalized' => '628156',
            'guest_key' => 'guest-y-8156',
            'send_status' => 'pending',
        ]);
        $log = BlastLog::query()->create([
            'invitation_id' => $inv->id,
            'triggered_by' => $user->id,
            'mode' => 'selected',
            'total' => 1,
            'success' => 0,
            'failed' => 0,
        ]);

        (new SendWhatsAppBlastJob($inv->id, [$guest->id], $log->id))->handle();

        $this->assertDatabaseHas('blast_log_items', ['blast_log_id' => $log->id, 'guest_id' => $guest->id, 'status' => 'sent']);
        $this->assertDatabaseHas('blast_logs', ['id' => $log->id, 'success' => 1, 'failed' => 0]);
    }
}
