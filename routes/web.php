<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\BlastController;
use App\Http\Controllers\ShareMetaController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\RsvpManagerController;
use App\Http\Controllers\GuestManagerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/api/invitations', [InvitationController::class, 'index'])->name('invitations.index');
    Route::post('/api/invitations', [InvitationController::class, 'store'])->name('invitations.store');
    Route::patch('/api/invitations/{invitation}', [InvitationController::class, 'update'])->name('invitations.update');
    Route::delete('/api/invitations/{invitation}', [InvitationController::class, 'destroy'])->name('invitations.destroy');

    Route::get('/api/invitations/{invitation}/rsvps', [RsvpController::class, 'index'])->name('rsvps.index');
    Route::get('/api/invitations/{invitation}/rsvps/summary', [RsvpController::class, 'summary'])->name('rsvps.summary');
    Route::get('/api/invitations/{invitation}/rsvps/export', [RsvpController::class, 'exportCsv'])->name('rsvps.export');
    Route::delete('/api/rsvps/{rsvp}', [RsvpController::class, 'destroy'])->name('rsvps.destroy');

    Route::get('/api/invitations/{invitation}/guests', [GuestController::class, 'index'])->name('guests.index');
    Route::post('/api/invitations/{invitation}/guests', [GuestController::class, 'store'])->name('guests.store');
    Route::post('/api/invitations/{invitation}/guests/import', [GuestController::class, 'import'])->name('guests.import');

    Route::post('/api/invitations/{invitation}/blast', [BlastController::class, 'trigger'])->name('blast.trigger');
    Route::get('/api/invitations/{invitation}/blast/logs', [BlastController::class, 'logs'])->name('blast.logs');
    Route::post('/api/invitations/{invitation}/blast/mode', [BlastController::class, 'triggerByMode'])->name('blast.trigger.mode');
    Route::post('/api/media/upload', [MediaController::class, 'upload'])->name('media.upload');

    Route::get('/invitations/{invitation}/rsvps', [RsvpManagerController::class, 'show'])->name('rsvp.manager');
    Route::get('/invitations/{invitation}/guests', [GuestManagerController::class, 'show'])->name('guest.manager');
});

Route::get('/i/{slug}', [InvitationController::class, 'publicBySlug'])->name('invitations.public.show');
Route::post('/i/{slug}/rsvp', [RsvpController::class, 'storePublic'])->name('rsvps.public.store');
Route::get('/api/share-meta', ShareMetaController::class)->name('share.meta');

require __DIR__.'/auth.php';
