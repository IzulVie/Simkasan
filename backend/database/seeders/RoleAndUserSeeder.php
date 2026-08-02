<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $ustadzRole = Role::create(['name' => 'ustadz', 'guard_name' => 'web']);
        $waliRole = Role::create(['name' => 'wali', 'guard_name' => 'web']);

        // Create users and assign roles
        $admin = User::create([
            'name' => 'Administrator SIMKASAN',
            'email' => 'admin@simkasan.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($adminRole);

        $ustadz = User::create([
            'name' => 'Ustadz Ahmad',
            'email' => 'ustadz@simkasan.com',
            'password' => Hash::make('password'),
        ]);
        $ustadz->assignRole($ustadzRole);

        $wali = User::create([
            'name' => 'Wali Santri (Budi)',
            'email' => 'wali@simkasan.com',
            'password' => Hash::make('password'),
        ]);
        $wali->assignRole($waliRole);
    }
}
