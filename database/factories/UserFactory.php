<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => "$firstName $lastName",
            'email' => fake()->unique()->safeEmail(),
            'mobile_number' => fake()->phoneNumber(),
            'role' => 'tenant',
            'status' => 'Active',
            'property_name' => fake()->randomElement([
                'Azure Heights',
                'Harbor Point',
                'Summit Row',
                'Luna Residences',
                'Riviera Flats',
            ]),
            'unit_number' => 'Unit '.fake()->randomNumber(3),
            'lease_start' => fake()->dateTimeBetween('-1 year', 'now'),
            'lease_end' => fake()->dateTimeBetween('now', '+1 year'),
            'monthly_rent' => fake()->randomFloat(2, 15000, 120000),
            'balance_due' => fake()->boolean(30) ? fake()->randomFloat(2, 500, 5000) : 0,
            'tenant_status' => fake()->randomElement(['Current', 'Expiring Soon', 'Overdue', 'Notice Given']),
            'concierge_name' => fake()->name(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
