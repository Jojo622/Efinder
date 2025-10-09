<?php

namespace Tests\Feature\Client;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyOwnerStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_inactive_owner_cannot_access_property_creation(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'status' => 'Inactive',
        ]);

        $response = $this->actingAs($owner)->get(route('properties.create'));

        $response->assertForbidden();
    }

    public function test_inactive_owner_cannot_store_property(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'status' => 'Inactive',
        ]);

        $response = $this->actingAs($owner)->post(route('properties.store'), []);

        $response->assertForbidden();
    }

    public function test_active_owner_can_access_property_creation(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($owner)->get(route('properties.create'));

        $response->assertOk();
    }
}
