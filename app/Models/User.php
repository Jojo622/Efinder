<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'mobile_number',
        'role',
        'status',
        'business_permit_path',
        'property_name',
        'unit_number',
        'lease_start',
        'lease_end',
        'monthly_rent',
        'balance_due',
        'tenant_status',
        'concierge_name',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'lease_start' => 'date',
            'lease_end' => 'date',
            'monthly_rent' => 'decimal:2',
            'balance_due' => 'decimal:2',
        ];
    }

    /**
     * Get the properties owned by the user.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get the invoices issued by the user as an owner.
     */
    public function ownedInvoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'owner_id');
    }

    /**
     * Get the invoices assigned to the user as a tenant.
     */
    public function tenantInvoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'tenant_id');
    }

    /**

     * Get the service tickets submitted by the user.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
    * Get the reservations assigned to the user as a tenant.
     */
    public function tenantReservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'tenant_id');
    }

    /**
     * Get the reservations managed by the user as an owner.
     */
    public function ownedReservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'owner_id');
    }
}
