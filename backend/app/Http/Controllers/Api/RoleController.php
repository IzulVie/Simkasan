<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of all roles with their permissions.
     */
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        return response()->json(['data' => $roles]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): JsonResponse
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Hanya administrator yang dapat melakukan aksi ini.'], 403);
        }

        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => strtolower($request->name),
            'guard_name' => 'web'
        ]);

        $role->syncPermissions($request->permissions);

        return response()->json([
            'message' => 'Role baru berhasil dibuat.',
            'data' => $role->load('permissions')
        ], 201);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Hanya administrator yang dapat melakukan aksi ini.'], 403);
        }

        $role = Role::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        // Prevent renaming critical system roles
        $systemRoles = ['admin', 'ustadz', 'wali'];
        $requestNameNormalized = strtolower($request->name);
        
        if (in_array($role->name, $systemRoles) && $role->name !== $requestNameNormalized) {
            return response()->json(['message' => 'Nama role bawaan sistem tidak boleh diubah.'], 422);
        }

        $role->update([
            'name' => $requestNameNormalized,
        ]);

        $role->syncPermissions($request->permissions);

        return response()->json([
            'message' => 'Role berhasil diperbarui.',
            'data' => $role->load('permissions')
        ], 200);
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Hanya administrator yang dapat melakukan aksi ini.'], 403);
        }

        $role = Role::findOrFail($id);
        
        // Prevent deleting critical system roles
        $systemRoles = ['admin', 'ustadz', 'wali'];
        if (in_array($role->name, $systemRoles)) {
            return response()->json(['message' => 'Role bawaan sistem tidak boleh dihapus.'], 422);
        }

        $role->delete();

        return response()->json([
            'message' => 'Role berhasil dihapus.'
        ], 200);
    }

    /**
     * Display a listing of all available permissions.
     */
    public function permissionsIndex(): JsonResponse
    {
        $permissions = Permission::all();
        return response()->json(['data' => $permissions]);
    }
}
