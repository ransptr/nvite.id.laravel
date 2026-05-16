<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadMediaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(UploadMediaRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $ownerId = $request->user()->id;
        $prefix = trim((string) $request->input('path_prefix', ''), '/');
        $invitationId = (string) $request->input('invitation_id', 'misc');
        $safeName = Str::random(8).'-'.time().'.'.$file->getClientOriginalExtension();
        $path = $ownerId.'/'.$invitationId.'/'.($prefix !== '' ? $prefix.'/' : '').$safeName;

        $disk = $this->resolveUploadDisk();

        Storage::disk($disk)->put($path, file_get_contents($file->getRealPath()), [
            'visibility' => 'public',
            'ContentType' => $file->getMimeType() ?: 'application/octet-stream',
        ]);

        $url = $disk === 'public'
            ? $request->getSchemeAndHttpHost().'/storage/'.$path
            : Storage::disk($disk)->url($path);

        return response()->json([
            'ok' => true,
            'path' => $path,
            'url' => $url,
        ], 201);
    }

    private function resolveUploadDisk(): string
    {
        $defaultDisk = Config::get('filesystems.default', 'public');

        if ($defaultDisk === 's3') {
            $diskConfig = Config::get('filesystems.disks.s3', []);
            $missing = Arr::where([
                'key' => $diskConfig['key'] ?? null,
                'secret' => $diskConfig['secret'] ?? null,
                'region' => $diskConfig['region'] ?? null,
                'bucket' => $diskConfig['bucket'] ?? null,
            ], fn ($value) => blank($value));

            if ($missing !== []) {
                return 'public';
            }
        }

        return $defaultDisk;
    }
}
