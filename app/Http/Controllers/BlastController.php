<?php

namespace App\Http\Controllers;

use App\Http\Requests\TriggerBlastRequest;
use App\Http\Requests\TriggerBlastModeRequest;
use App\Jobs\SendWhatsAppBlastJob;
use App\Models\BlastLog;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlastController extends Controller
{
    public function trigger(TriggerBlastRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);

        $guestIds = $request->validated('guest_ids');
        $log = BlastLog::query()->create([
            'invitation_id' => $invitation->id,
            'triggered_by' => $request->user()->id,
            'mode' => $request->validated('mode') ?? 'selected',
            'total' => count($guestIds),
            'success' => 0,
            'failed' => 0,
        ]);

        SendWhatsAppBlastJob::dispatch($invitation->id, $guestIds, $log->id);

        return response()->json(['ok' => true, 'blast_log_id' => $log->id], 202);
    }

    public function logs(Request $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('view', $invitation);
        return response()->json($invitation->blastLogs()->latest()->limit(20)->get());
    }

    public function triggerByMode(TriggerBlastModeRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);
        $mode = $request->validated('mode');

        $query = Guest::query()->where('invitation_id', $invitation->id);
        if ($mode === 'selected') {
            $query->whereIn('id', $request->validated('guest_ids') ?? []);
        } elseif ($mode === 'retry_failed') {
            $query->where('send_status', 'failed');
        }

        $guestIds = $query->pluck('id')->all();
        if (count($guestIds) === 0) {
            return response()->json(['ok' => false, 'message' => 'No guests to send'], 422);
        }

        $log = BlastLog::query()->create([
            'invitation_id' => $invitation->id,
            'triggered_by' => $request->user()->id,
            'mode' => $mode,
            'total' => count($guestIds),
            'success' => 0,
            'failed' => 0,
        ]);

        SendWhatsAppBlastJob::dispatch($invitation->id, $guestIds, $log->id);

        return response()->json(['ok' => true, 'blast_log_id' => $log->id], 202);
    }
}
