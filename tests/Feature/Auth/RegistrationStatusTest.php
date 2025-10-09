<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_accounts_are_created_as_inactive(): void
    {
        $response = $this->post(route('register.store'), [
            'first_name' => 'Owner',
            'last_name' => 'User',
            'mobile_number' => '1234567890',
            'role' => 'owner',
            'email' => 'owner@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users', [
            'email' => 'owner@example.com',
            'status' => 'Inactive',
        ]);
    }

    public function test_tenant_accounts_are_created_as_active(): void
    {
        $response = $this->post(route('register.store'), [
            'first_name' => 'Tenant',
            'last_name' => 'User',
            'mobile_number' => '1234567890',
            'role' => 'tenant',
            'email' => 'tenant@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users', [
            'email' => 'tenant@example.com',
            'status' => 'Active',
        ]);
    }
}
