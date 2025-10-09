<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'status',
        'monthly_rent',
        'security_deposit',
        'location',
        'street_address',
        'city',
        'barangay',
        'latitude',
        'longitude',
        'bedrooms',
        'bathrooms',
        'square_footage',
        'parking_spaces',
        'availability_date',
        'lease_term',
        'contact_name',
        'contact_email',
        'contact_phone',
        'amenities',
        'description',
        'hero_image',
        'gallery_images',
        'pet_policy',
        'notes',
        'availability_photo_path',
    ];

    protected $casts = [
        'availability_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    /**
     * Get the user that owns the property.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reservations associated with the property.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
