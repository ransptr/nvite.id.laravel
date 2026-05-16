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

Route::get('/claire', function () {
    return redirect('/templates/lumiere');
});

Route::get('/templates/{templateSlug}', function (string $templateSlug) {
    return Inertia::render('TemplatePreview', ['templateSlug' => $templateSlug]);
})->name('templates.preview');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/api/profile', [ProfileController::class, 'showApi'])->name('profile.show.api');
    Route::patch('/api/profile', [ProfileController::class, 'updateApi'])->name('profile.update.api');

    Route::get('/api/invitations', [InvitationController::class, 'index'])->name('invitations.index');
    Route::post('/api/invitations', [InvitationController::class, 'store'])->name('invitations.store');
    Route::patch('/api/invitations/{invitation}', [InvitationController::class, 'update'])->name('invitations.update');
    Route::delete('/api/invitations/{invitation}', [InvitationController::class, 'destroy'])->name('invitations.destroy');
    Route::get('/api/invitations/check-slug', [InvitationController::class, 'checkSlug'])->name('invitations.check.slug');

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

Route::get('/i/{slug}/data', [InvitationController::class, 'publicBySlug'])->name('invitations.public.show');
Route::get('/i/{slug}/rsvps', [RsvpController::class, 'publicIndex'])->name('rsvps.public.index');
Route::post('/i/{slug}/rsvp', [RsvpController::class, 'storePublic'])->name('rsvps.public.store');
Route::get('/api/guests/resolve', [GuestController::class, 'resolve'])->name('guests.resolve');
Route::get('/api/share-meta', ShareMetaController::class)->name('share.meta');

Route::get('/dashboard/{any?}', function () {
    return Inertia::render('DashboardApp');
})->middleware(['auth', 'verified'])->where('any', '.*')->name('dashboard');

Route::get('/{slug}', function (string $slug) {
    return Inertia::render('PublicInvitation', ['slug' => $slug]);
})->where('slug', '^(?!login$|register$|forgot-password$|reset-password$|verify-email$|confirm-password$|email$|profile$|dashboard$|templates$|api$|storage$|up$|sanctum$)[A-Za-z0-9-]+$')->name('invitations.public.page');

require __DIR__.'/auth.php';
