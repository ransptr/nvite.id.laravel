<?php

namespace App\Console\Commands;

use App\Models\BlastLog;
use App\Models\BlastLogItem;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Profile;
use App\Models\Rsvp;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

#[Signature('app:import-supabase-data {--dir= : Directory containing exported JSON files} {--dry-run : Validate payload only} {--report-only : Print integrity report without importing}')]
#[Description('Imports Supabase-exported JSON data into local MySQL schema')]
class ImportSupabaseData extends Command
{
    private int $rewrittenUrlCount = 0;
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dir = (string) ($this->option('dir') ?: 'storage/app/migration/supabase');
        $dryRun = (bool) $this->option('dry-run');
        $reportOnly = (bool) $this->option('report-only');

        $tables = [
            'users' => User::class,
            'profiles' => Profile::class,
            'invitations' => Invitation::class,
            'rsvps' => Rsvp::class,
            'guests' => Guest::class,
            'blast_logs' => BlastLog::class,
            'blast_log_items' => BlastLogItem::class,
        ];

        foreach (array_keys($tables) as $table) {
            $path = base_path(trim($dir, '/').'/'.$table.'.json');
            if (!file_exists($path)) {
                $this->error("Missing file: {$path}");
                return self::FAILURE;
            }
        }

        if ($dryRun) {
            $this->info('Dry run passed: all source files are present.');
            return self::SUCCESS;
        }

        if ($reportOnly) {
            $this->printIntegrityReport();
            return self::SUCCESS;
        }

        $this->rewrittenUrlCount = 0;

        DB::transaction(function () use ($dir, $tables): void {
            foreach ($tables as $table => $modelClass) {
                $records = json_decode((string) file_get_contents(base_path(trim($dir, '/').'/'.$table.'.json')), true);
                if (!is_array($records)) {
                    throw new \RuntimeException("Invalid JSON payload for {$table}");
                }

                foreach ($records as $record) {
                    if ($table === 'users' && isset($record['password']) && !str_starts_with((string) $record['password'], '$2y$')) {
                        $record['password'] = Hash::make((string) $record['password']);
                    }
                    if ($table === 'invitations' && isset($record['content']) && is_array($record['content'])) {
                        $record['content'] = $this->rewriteMediaUrls($record['content']);
                    }
                    $modelClass::query()->upsert([$record], ['id']);
                }

                $this->line("Imported {$table}: ".count($records));
            }
        });

        $this->info('Supabase import completed.');
        $this->printIntegrityReport();

        return self::SUCCESS;
    }

    private function rewriteMediaUrls(array $content): array
    {
        $from = rtrim((string) env('SUPABASE_STORAGE_BASE_URL', ''), '/');
        $to = rtrim((string) env('NVITE_MEDIA_BASE_URL', ''), '/');

        if ($from === '' || $to === '') {
            return $content;
        }

        $walker = function ($value) use (&$walker, $from, $to) {
            if (is_array($value)) {
                $out = [];
                foreach ($value as $k => $v) {
                    $out[$k] = $walker($v);
                }
                return $out;
            }

            if (is_string($value) && str_starts_with($value, $from)) {
                $this->rewrittenUrlCount++;
                return $to.substr($value, strlen($from));
            }

            return $value;
        };

        return $walker($content);
    }

    private function printIntegrityReport(): void
    {
        $users = User::query()->count();
        $profiles = Profile::query()->count();
        $invitations = Invitation::query()->count();
        $rsvps = Rsvp::query()->count();
        $guests = Guest::query()->count();
        $blastLogs = BlastLog::query()->count();
        $blastItems = BlastLogItem::query()->count();

        $orphanInvitations = Invitation::query()
            ->leftJoin('profiles', 'profiles.id', '=', 'invitations.owner_id')
            ->whereNull('profiles.id')
            ->count();
        $orphanRsvps = Rsvp::query()
            ->leftJoin('invitations', 'invitations.id', '=', 'rsvps.invitation_id')
            ->whereNull('invitations.id')
            ->count();
        $orphanGuests = Guest::query()
            ->leftJoin('invitations', 'invitations.id', '=', 'guests.invitation_id')
            ->whereNull('invitations.id')
            ->count();

        $this->info('--- Integrity Report ---');
        $this->line("users={$users} profiles={$profiles} invitations={$invitations} rsvps={$rsvps} guests={$guests} blast_logs={$blastLogs} blast_log_items={$blastItems}");
        $this->line("orphans: invitations={$orphanInvitations} rsvps={$orphanRsvps} guests={$orphanGuests}");
        $this->line("media_urls_rewritten={$this->rewrittenUrlCount}");
    }
}
