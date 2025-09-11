<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'address',
        'geo',
        'amenities',
    ];

    protected $casts = [
        'geo' => 'array',
        'amenities' => 'array',
    ];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}

