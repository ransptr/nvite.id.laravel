<?php

namespace Tests\Feature\Api;

use App\Models\Invitation;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GuestApiTest extends TestCase
{
    use DatabaseMigrations;

    public function test_owner_can_add_guest(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner2@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'guest-slug',
            'is_published' => false,
            'content' => ['seo' => ['title' => 't']],
        ]);

        $response = $this->actingAs($user)->postJson('/api/invitations/'.$inv->id.'/guests', [
            'name' => 'Guest B',
            'phone_raw' => '08123',
            'phone_normalized' => '628123',
            'guest_key' => 'guest-b-8123',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('guests', ['invitation_id' => $inv->id, 'name' => 'Guest B']);
    }

    public function test_owner_can_import_guests_from_payload(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner4@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        $inv = Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'import-slug',
            'is_published' => false,
            'content' => ['seo' => ['title' => 't']],
        ]);

        $response = $this->actingAs($user)->postJson('/api/invitations/'.$inv->id.'/guests/import', [
            'guests' => [
                [
                    'name' => 'Guest D',
                    'phone_raw' => '08124',
                    'phone_normalized' => '628124',
                    'guest_key' => 'guest-d-8124',
                ],
            ],
        ]);

        $response->assertOk()->assertJson(['added' => 1, 'skipped' => 0]);
        $this->assertDatabaseHas('guests', ['invitation_id' => $inv->id, 'name' => 'Guest D']);
    }
}
