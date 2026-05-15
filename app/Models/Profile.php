<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'plan',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class, 'owner_id');
    }
}
