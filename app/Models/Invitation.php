<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'owner_id',
        'slug',
        'is_published',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'content' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'owner_id');
    }

    public function rsvps(): HasMany
    {
        return $this->hasMany(Rsvp::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function blastLogs(): HasMany
    {
        return $this->hasMany(BlastLog::class);
    }
}
