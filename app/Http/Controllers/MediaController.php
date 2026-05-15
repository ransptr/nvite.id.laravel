<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadMediaRequest;
use Illuminate\Http\JsonResponse;
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

        Storage::disk('s3')->put($path, file_get_contents($file->getRealPath()), [
            'visibility' => 'public',
            'ContentType' => $file->getMimeType() ?: 'application/octet-stream',
        ]);

        $url = Storage::disk('s3')->url($path);

        return response()->json([
            'ok' => true,
            'path' => $path,
            'url' => $url,
        ], 201);
    }
}
