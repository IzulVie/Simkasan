<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 422);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout.',
        ]);
    }

    /**
     * Get authenticated user details.
     */
    public function me(Request $request): UserResource
    {
        $user = $request->user();
        if ($user->hasRole('wali')) {
            $user->load(['waliProfile.santris.kelas']);
        }

        return new UserResource($user);
    }

    /**
     * Register a new user (Admin Only).
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['role']);

        return response()->json([
            'message' => 'User berhasil didaftarkan.',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Get list of admin and ustadz users (Admin Only).
     */
    public function usersIndex(): JsonResponse
    {
        $users = User::with('roles')->whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'ustadz']);
        })->get();

        // Map roles to a simple field
        $users->map(function ($u) {
            $u->role = $u->roles->first()?->name;

            return $u;
        });

        return response()->json($users);
    }

    /**
     * Update an admin or ustadz user (Admin Only).
     */
    public function usersUpdate(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:admin,ustadz'],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        // Sync role
        $user->syncRoles([$data['role']]);

        $user->role = $data['role'];

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'user' => $user,
        ]);
    }

    /**
     * Delete an admin or ustadz user (Admin Only).
     */
    public function usersDestroy(User $user): JsonResponse
    {
        // Prevent deleting oneself
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus.',
        ]);
    }
}
