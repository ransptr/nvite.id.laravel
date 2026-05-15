<?php

namespace App\Jobs;

use App\Models\BlastLog;
use App\Models\BlastLogItem;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class SendWhatsAppBlastJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $invitationId,
        public array $guestIds,
        public string $blastLogId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $success = 0;
        $failed = 0;

        $guests = Guest::query()
            ->where('invitation_id', $this->invitationId)
            ->whereIn('id', $this->guestIds)
            ->get();
        $invitation = Invitation::query()->find($this->invitationId);
        $slug = $invitation?->slug ?? 'invitation';
        $couple = data_get($invitation?->content ?? [], 'couple.joinedName', $slug);
        $origin = rtrim((string) env('PUBLIC_APP_URL', config('app.url')), '/');

        foreach ($guests as $guest) {
            $resp = Http::withHeaders([
                'Authorization' => (string) config('services.fonnte.token'),
                'Content-Type' => 'application/json',
            ])->post((string) config('services.fonnte.endpoint'), [
                'target' => $guest->phone_normalized,
                'message' => "Halo {$guest->name}, kami mengundang Anda ke pernikahan {$couple}. Buka undangan: {$origin}/{$slug}?to={$guest->guest_key}",
            ]);

            $ok = $resp->successful();
            $error = $ok ? null : ($resp->body() ?: 'Failed to send');

            $guest->update([
                'send_status' => $ok ? 'sent' : 'failed',
                'last_sent_at' => $ok ? now() : null,
                'last_error' => $error,
            ]);

            BlastLogItem::query()->create([
                'blast_log_id' => $this->blastLogId,
                'guest_id' => $guest->id,
                'status' => $ok ? 'sent' : 'failed',
                'error' => $error,
                'provider_message_id' => null,
            ]);

            if ($ok) {
                $success++;
            } else {
                $failed++;
            }
        }

        BlastLog::query()->where('id', $this->blastLogId)->update([
            'success' => $success,
            'failed' => $failed,
        ]);
    }
}
