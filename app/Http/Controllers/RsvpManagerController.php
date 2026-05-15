<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Inertia\Inertia;
use Inertia\Response;

class RsvpManagerController extends Controller
{
    public function show(Invitation $invitation): Response
    {
        return Inertia::render('RsvpManager', [
            'invitationId' => $invitation->id,
            'slug' => $invitation->slug,
        ]);
    }
}
