<?php

namespace Tests\Feature\Api;

use App\Models\Invitation;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class RsvpApiTest extends TestCase
{
    use DatabaseMigrations;

    public function test_public_rsvp_can_be_submitted(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'test-slug',
            'is_published' => true,
            'content' => ['seo' => ['title' => 't']],
        ]);

        $response = $this->postJson('/i/test-slug/rsvp', [
            'guest_name' => 'Guest A',
            'attendance' => 'attending',
            'guest_count' => 2,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('rsvps', ['invitation_id' => $inv->id, 'guest_name' => 'Guest A']);
    }

    public function test_owner_can_get_rsvp_summary(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner5@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'sum-slug',
            'is_published' => true,
            'content' => ['seo' => ['title' => 't']],
        ]);

        $this->postJson('/i/sum-slug/rsvp', ['guest_name' => 'A', 'attendance' => 'attending', 'guest_count' => 2])->assertCreated();
        $this->postJson('/i/sum-slug/rsvp', ['guest_name' => 'B', 'attendance' => 'not_attending', 'guest_count' => 1])->assertCreated();

        $response = $this->actingAs($user)->getJson('/api/invitations/'.$inv->id.'/rsvps/summary');
        $response->assertOk()->assertJson([
            'attending_count' => 1,
            'not_attending_count' => 1,
            'total_responses' => 2,
            'total_guests' => 2,
        ]);
    }

    public function test_owner_can_export_rsvp_csv(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner7@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'csv-slug',
            'is_published' => true,
            'content' => ['seo' => ['title' => 't']],
        ]);
        $this->postJson('/i/csv-slug/rsvp', ['guest_name' => 'A', 'attendance' => 'attending', 'guest_count' => 1])->assertCreated();

        $inv = Invitation::query()->where('slug', 'csv-slug')->firstOrFail();
        $response = $this->actingAs($user)->get('/api/invitations/'.$inv->id.'/rsvps/export');
        $response->assertOk();
        $this->assertStringContainsString('Name,Attendance,Guests,Wishes,Date', $response->getContent());
    }
}
