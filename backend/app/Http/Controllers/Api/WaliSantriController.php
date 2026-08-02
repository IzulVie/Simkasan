<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WaliSantriRequest;
use App\Http\Resources\WaliSantriResource;
use App\Models\User;
use App\Models\WaliSantri;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class WaliSantriController extends Controller
{
    /**
     * Display a listing of wali santris.
     */
    public function index(): AnonymousResourceCollection
    {
        $walis = WaliSantri::with(['user', 'santris'])->get();

        return WaliSantriResource::collection($walis);
    }

    /**
     * Store a newly created wali santri.
     */
    public function store(WaliSantriRequest $request): JsonResponse
    {
        $data = $request->validated();

        $wali = DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'name' => $data['nama'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            $user->assignRole('wali');

            // Create WaliSantri
            $wali = WaliSantri::create([
                'user_id' => $user->id,
                'nama' => $data['nama'],
                'no_hp' => $data['no_hp'],
            ]);

            // Sync children
            if (isset($data['santri_ids'])) {
                $wali->santris()->sync($data['santri_ids']);
            }

            return $wali;
        });

        return response()->json([
            'message' => 'Wali Santri berhasil ditambahkan.',
            'data' => new WaliSantriResource($wali->load(['user', 'santris'])),
        ], 201);
    }

    /**
     * Display the specified wali santri.
     */
    public function show(WaliSantri $waliSantri): WaliSantriResource
    {
        return new WaliSantriResource($waliSantri->load(['user', 'santris']));
    }

    /**
     * Update the specified wali santri.
     */
    public function update(WaliSantriRequest $request, WaliSantri $waliSantri): JsonResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $waliSantri) {
            // Update User details if provided
            $userUpdates = [
                'name' => $data['nama'],
            ];

            if (isset($data['email'])) {
                $userUpdates['email'] = $data['email'];
            }

            if (isset($data['password']) && ! empty($data['password'])) {
                $userUpdates['password'] = Hash::make($data['password']);
            }

            $waliSantri->user->update($userUpdates);

            // Update WaliSantri
            $waliSantri->update([
                'nama' => $data['nama'],
                'no_hp' => $data['no_hp'],
            ]);

            // Sync children
            if (isset($data['santri_ids'])) {
                $waliSantri->santris()->sync($data['santri_ids']);
            }
        });

        return response()->json([
            'message' => 'Wali Santri berhasil diperbarui.',
            'data' => new WaliSantriResource($waliSantri->load(['user', 'santris'])),
        ]);
    }

    /**
     * Remove the specified wali santri.
     */
    public function destroy(WaliSantri $waliSantri): JsonResponse
    {
        DB::transaction(function () use ($waliSantri) {
            // Deleting the user will cascade delete the WaliSantri
            $waliSantri->user->delete();
        });

        return response()->json([
            'message' => 'Wali Santri berhasil dihapus.',
        ]);
    }
}
