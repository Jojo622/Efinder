<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'bed',
        'bath',
        'floor_area',
        'rent',
        'deposits',
        'policies',
        'availability',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}

