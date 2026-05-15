<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Inertia\Inertia;
use Inertia\Response;

class GuestManagerController extends Controller
{
    public function show(Invitation $invitation): Response
    {
        return Inertia::render('GuestManager', [
            'invitationId' => $invitation->id,
            'slug' => $invitation->slug,
        ]);
    }
}
