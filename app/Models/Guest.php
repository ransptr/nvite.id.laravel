<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'invitation_id',
        'name',
        'phone_raw',
        'phone_normalized',
        'guest_key',
        'send_status',
        'last_sent_at',
        'last_error',
        'provider_message_id',
    ];

    protected function casts(): array
    {
        return [
            'last_sent_at' => 'datetime',
        ];
    }

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    public function blastLogItems(): HasMany
    {
        return $this->hasMany(BlastLogItem::class);
    }
}
