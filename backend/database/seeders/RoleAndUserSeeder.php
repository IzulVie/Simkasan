<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
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

        // Create permissions
        $permissions = [
            'menu_master_data',
            'menu_absensi',
            'menu_hafalan',
            'menu_nilai',
            'menu_kegiatan',
            'menu_iuran',
            'manage_roles',
        ];

        foreach ($permissions as $permissionName) {
            Permission::create(['name' => $permissionName, 'guard_name' => 'web']);
        }

        // Create roles
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $ustadzRole = Role::create(['name' => 'ustadz', 'guard_name' => 'web']);
        $waliRole = Role::create(['name' => 'wali', 'guard_name' => 'web']);

        // Assign permissions
        $adminRole->givePermissionTo(Permission::all());
        
        $teacherPermissions = [
            'menu_absensi',
            'menu_hafalan',
            'menu_nilai',
            'menu_kegiatan',
        ];
        $ustadzRole->givePermissionTo($teacherPermissions);
        $waliRole->givePermissionTo($teacherPermissions);

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
