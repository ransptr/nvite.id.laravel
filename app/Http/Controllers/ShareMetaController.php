<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class ShareMetaController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $slug = (string) $request->query('slug', '');
        $origin = $request->getSchemeAndHttpHost();
        $targetUrl = $slug !== '' ? $origin.'/'.$slug : $origin;

        $title = 'nvite.id';
        $description = 'Create beautiful digital wedding invitations';
        $image = 'https://nvite.id/og-image-default.png';

        if ($slug !== '') {
            $inv = Invitation::query()->where('slug', $slug)->where('is_published', true)->first();
            if ($inv) {
                $content = (array) $inv->content;
                $title = data_get($content, 'seo.title', $title);
                $description = data_get($content, 'seo.description', $description);
                $image = data_get($content, 'media.ogImage', data_get($content, 'media.coverImage', $image));
            }
        }

        $html = "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>{$title}</title><meta name=\"description\" content=\"{$description}\" /><meta property=\"og:type\" content=\"website\" /><meta property=\"og:title\" content=\"{$title}\" /><meta property=\"og:description\" content=\"{$description}\" /><meta property=\"og:url\" content=\"{$targetUrl}\" /><meta property=\"og:image\" content=\"{$image}\" /><meta name=\"twitter:card\" content=\"summary_large_image\" /><meta name=\"twitter:title\" content=\"{$title}\" /><meta name=\"twitter:description\" content=\"{$description}\" /><meta name=\"twitter:image\" content=\"{$image}\" /><meta http-equiv=\"refresh\" content=\"0;url={$targetUrl}\" /></head><body><p>Redirecting to <a href=\"{$targetUrl}\">{$targetUrl}</a>...</p></body></html>";

        return response($html, 200, [
            'content-type' => 'text/html; charset=utf-8',
            'cache-control' => 'public, s-maxage=300, stale-while-revalidate=86400',
        ]);
    }
}
