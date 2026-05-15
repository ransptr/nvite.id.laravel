<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvitationRequest;
use App\Http\Requests\UpdateInvitationRequest;
use App\Models\Invitation;
use App\Models\Profile;
use App\Support\InvitationContentNormalizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function __construct(private readonly InvitationContentNormalizer $normalizer) {}

    public function index(Request $request): JsonResponse
    {
        $invitations = Invitation::query()
            ->where('owner_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($invitations);
    }

    public function store(StoreInvitationRequest $request): JsonResponse
    {
        $profile = Profile::query()->find($request->user()->id);
        $plan = $profile?->plan ?? 'free';
        $limits = ['free' => 1, 'basic' => 3, 'pro' => PHP_INT_MAX];
        $currentCount = Invitation::query()->where('owner_id', $request->user()->id)->count();
        if ($currentCount >= ($limits[$plan] ?? 1)) {
            return response()->json(['error' => 'Invitation limit reached for your plan.'], 422);
        }

        $invitation = Invitation::query()->create([
            'owner_id' => $request->user()->id,
            ...$request->validated(),
            'content' => $this->normalizer->normalize((array) $request->validated('content')),
            'is_published' => $request->boolean('is_published'),
        ]);

        return response()->json($invitation, 201);
    }

    public function update(UpdateInvitationRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);

        $payload = $request->validated();
        if (array_key_exists('content', $payload)) {
            $payload['content'] = $this->normalizer->normalize((array) $payload['content']);
        }
        $invitation->update($payload);

        return response()->json($invitation->fresh());
    }

    public function destroy(Request $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('delete', $invitation);

        $invitation->delete();

        return response()->json(['ok' => true]);
    }

    public function publicBySlug(string $slug): JsonResponse
    {
        $invitation = Invitation::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json($invitation);
    }
}
