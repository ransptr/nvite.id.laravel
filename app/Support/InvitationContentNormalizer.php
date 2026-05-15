<?php

namespace App\Support;

class InvitationContentNormalizer
{
    public function normalize(array $content): array
    {
        $content['seo'] = array_merge([
            'title' => 'nvite.id',
            'description' => 'Create beautiful digital wedding invitations',
        ], (array) ($content['seo'] ?? []));

        $content['media'] = array_merge([
            'ogImage' => '',
            'coverImage' => '',
        ], (array) ($content['media'] ?? []));

        $content['couple'] = array_merge([
            'joinedName' => '',
        ], (array) ($content['couple'] ?? []));

        $content['rsvp'] = array_merge([
            'maxGuestsDefault' => 1,
            'comments' => [],
            'qr_enabled' => true,
        ], (array) ($content['rsvp'] ?? []));

        return $content;
    }
}
