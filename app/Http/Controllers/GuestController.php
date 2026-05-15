<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportGuestsRequest;
use App\Http\Requests\StoreGuestRequest;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Rap2hpoutre\FastExcel\FastExcel;

class GuestController extends Controller
{
    public function index(Request $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('view', $invitation);
        return response()->json($invitation->guests()->latest()->get());
    }

    public function store(StoreGuestRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);

        $guest = Guest::query()->create([
            'invitation_id' => $invitation->id,
            ...$request->validated(),
            'send_status' => 'pending',
        ]);

        return response()->json($guest, 201);
    }

    public function import(ImportGuestsRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);
        $rows = $request->validated('guests') ?? [];
        if ($request->hasFile('file')) {
            $ext = strtolower((string) $request->file('file')->getClientOriginalExtension());
            $rows = in_array($ext, ['xlsx', 'xls'], true)
                ? $this->parseExcelRows($request->file('file')->getPathname())
                : $this->parseCsvRows((string) $request->file('file')->get());
        }

        if (count($rows) === 0) {
            return response()->json(['added' => 0, 'skipped' => 0, 'errors' => ['No guest rows found']], 422);
        }

        $added = 0;
        $skipped = 0;

        foreach ($rows as $row) {
            $exists = Guest::query()
                ->where('invitation_id', $invitation->id)
                ->where('phone_normalized', $row['phone_normalized'])
                ->exists();

            if ($exists) {
                $skipped++;
                continue;
            }

            Guest::query()->create([
                'invitation_id' => $invitation->id,
                'name' => $row['name'],
                'phone_raw' => $row['phone_raw'],
                'phone_normalized' => $row['phone_normalized'],
                'guest_key' => $row['guest_key'],
                'send_status' => 'pending',
            ]);
            $added++;
        }

        return response()->json(['added' => $added, 'skipped' => $skipped]);
    }

    private function parseCsvRows(string $csv): array
    {
        $lines = preg_split('/\r\n|\r|\n/', trim($csv)) ?: [];
        if (count($lines) < 2) {
            return [];
        }

        $header = str_getcsv((string) array_shift($lines));
        $map = array_flip(array_map(fn ($h) => strtolower(trim((string) $h)), $header));
        $required = ['name', 'phone_raw', 'phone_normalized', 'guest_key'];

        foreach ($required as $key) {
            if (!array_key_exists($key, $map)) {
                return [];
            }
        }

        $rows = [];
        foreach ($lines as $line) {
            if (trim($line) === '') {
                continue;
            }
            $cols = str_getcsv($line);
            $rows[] = [
                'name' => (string) ($cols[$map['name']] ?? ''),
                'phone_raw' => (string) ($cols[$map['phone_raw']] ?? ''),
                'phone_normalized' => (string) ($cols[$map['phone_normalized']] ?? ''),
                'guest_key' => (string) ($cols[$map['guest_key']] ?? ''),
            ];
        }

        return $rows;
    }

    private function parseExcelRows(string $path): array
    {
        $sheet = (new FastExcel())->import($path);
        $rows = [];
        foreach ($sheet as $row) {
            $rows[] = [
                'name' => (string) ($row['name'] ?? ''),
                'phone_raw' => (string) ($row['phone_raw'] ?? ''),
                'phone_normalized' => (string) ($row['phone_normalized'] ?? ''),
                'guest_key' => (string) ($row['guest_key'] ?? ''),
            ];
        }
        return $rows;
    }
}
