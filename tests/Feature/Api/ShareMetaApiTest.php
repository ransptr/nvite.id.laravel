<?php

namespace Tests\Feature\Api;

use App\Models\Invitation;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ShareMetaApiTest extends TestCase
{
    use DatabaseMigrations;

    public function test_share_meta_uses_published_invitation_content(): void
    {
        $user = User::query()->create(['name' => 'Owner', 'email' => 'owner10@example.com', 'password' => 'password']);
        Profile::query()->create(['id' => $user->id, 'plan' => 'free']);
        Invitation::query()->create([
            'owner_id' => $user->id,
            'slug' => 'meta-slug',
            'is_published' => true,
            'content' => [
                'seo' => ['title' => 'Meta Title', 'description' => 'Meta Desc'],
                'media' => ['ogImage' => 'https://cdn.example.com/meta.jpg'],
            ],
        ]);

        $response = $this->get('/api/share-meta?slug=meta-slug');

        $response->assertStatus(200);
        $response->assertSee('Meta Title');
        $response->assertSee('Meta Desc');
        $response->assertSee('https://cdn.example.com/meta.jpg');
    }
}
