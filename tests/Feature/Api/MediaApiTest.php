<?php

namespace Tests\Feature\Api;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaApiTest extends TestCase
{
    use DatabaseMigrations;

    public function test_owner_can_upload_media_to_s3_disk(): void
    {
        Storage::fake('s3');
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner9@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);

        $file = UploadedFile::fake()->image('photo.jpg');
        $response = $this->actingAs($user)->post('/api/media/upload', [
            'file' => $file,
            'invitation_id' => 'inv-1',
            'path_prefix' => 'gallery',
        ]);

        $response->assertCreated()->assertJsonStructure(['ok', 'path', 'url']);
        $path = $response->json('path');
        Storage::disk('s3')->assertExists($path);
    }

    public function test_guest_cannot_upload_media(): void
    {
        $response = $this->post('/api/media/upload', []);
        $response->assertRedirect('/login');
    }
}
