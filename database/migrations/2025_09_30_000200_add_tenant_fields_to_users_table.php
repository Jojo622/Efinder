<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (!Schema::hasColumn('users', 'property_name')) {
                $table->string('property_name')->nullable()->after('role');
            }

            if (!Schema::hasColumn('users', 'unit_number')) {
                $table->string('unit_number')->nullable()->after('property_name');
            }

            if (!Schema::hasColumn('users', 'lease_start')) {
                $table->date('lease_start')->nullable()->after('unit_number');
            }

            if (!Schema::hasColumn('users', 'lease_end')) {
                $table->date('lease_end')->nullable()->after('lease_start');
            }

            if (!Schema::hasColumn('users', 'monthly_rent')) {
                $table->decimal('monthly_rent', 12, 2)->nullable()->after('lease_end');
            }

            if (!Schema::hasColumn('users', 'balance_due')) {
                $table->decimal('balance_due', 12, 2)->nullable()->default(0)->after('monthly_rent');
            }

            if (!Schema::hasColumn('users', 'tenant_status')) {
                $table->string('tenant_status')->nullable()->after('balance_due');
            }

            if (!Schema::hasColumn('users', 'concierge_name')) {
                $table->string('concierge_name')->nullable()->after('tenant_status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $drops = [
                'concierge_name',
                'tenant_status',
                'balance_due',
                'monthly_rent',
                'lease_end',
                'lease_start',
                'unit_number',
                'property_name',
            ];

            foreach ($drops as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
