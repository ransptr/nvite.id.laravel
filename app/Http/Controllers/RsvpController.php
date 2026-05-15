<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRsvpRequest;
use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RsvpController extends Controller
{
    public function index(Request $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('view', $invitation);

        $items = $invitation->rsvps()->latest()->get();

        return response()->json($items);
    }

    public function storePublic(StoreRsvpRequest $request, string $slug): JsonResponse
    {
        $invitation = Invitation::query()->where('slug', $slug)->where('is_published', true)->firstOrFail();

        $payload = $request->validated();
        $attendance = $payload['attendance'];
        $guestCount = (int) ($payload['guest_count'] ?? 1);
        if ($attendance === 'not_attending') {
            $guestCount = 0;
        }

        $rsvp = Rsvp::query()->create([
            'invitation_id' => $invitation->id,
            'guest_name' => $payload['guest_name'],
            'attendance' => $attendance,
            'guest_count' => $guestCount,
            'wishes' => $payload['wishes'] ?? null,
            'qr_value' => $payload['qr_value'] ?? null,
        ]);

        return response()->json($rsvp, 201);
    }

    public function destroy(Request $request, Rsvp $rsvp): JsonResponse
    {
        $this->authorize('delete', $rsvp);
        $rsvp->delete();
        return response()->json(['ok' => true]);
    }

    public function summary(Request $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('view', $invitation);
        $all = $invitation->rsvps()->get();
        $attending = $all->where('attendance', 'attending');
        $notAttending = $all->where('attendance', 'not_attending');

        return response()->json([
            'attending_count' => $attending->count(),
            'not_attending_count' => $notAttending->count(),
            'total_responses' => $all->count(),
            'total_guests' => $attending->sum('guest_count'),
        ]);
    }

    public function exportCsv(Request $request, Invitation $invitation)
    {
        $this->authorize('view', $invitation);
        $rows = $invitation->rsvps()->latest()->get();
        $csv = "Name,Attendance,Guests,Wishes,Date\n";
        foreach ($rows as $r) {
            $csv .= sprintf(
                "\"%s\",%s,%d,\"%s\",%s\n",
                str_replace('"', '""', $r->guest_name),
                $r->attendance,
                (int) $r->guest_count,
                str_replace('"', '""', (string) ($r->wishes ?? '')),
                $r->created_at?->format('Y-m-d')
            );
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="rsvps-'.$invitation->slug.'.csv"',
        ]);
    }
}
