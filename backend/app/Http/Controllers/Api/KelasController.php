<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\KelasRequest;
use App\Http\Resources\KelasResource;
use App\Models\Kelas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class KelasController extends Controller
{
    /**
     * Display a listing of classes.
     */
    public function index(): AnonymousResourceCollection
    {
        $kelas = Kelas::withCount('santris')->get();

        return KelasResource::collection($kelas);
    }

    /**
     * Store a newly created class.
     */
    public function store(KelasRequest $request): JsonResponse
    {
        $kelas = Kelas::create($request->validated());

        return response()->json([
            'message' => 'Kelas berhasil ditambahkan.',
            'data' => new KelasResource($kelas->loadCount('santris')),
        ], 201);
    }

    /**
     * Display the specified class.
     */
    public function show(Kelas $kela): KelasResource
    {
        // Route model binding parameter name for resource route 'kelas' is 'kela' by default in Laravel pluralization rules.
        return new KelasResource($kela->loadCount('santris'));
    }

    /**
     * Update the specified class.
     */
    public function update(KelasRequest $request, Kelas $kela): JsonResponse
    {
        $kela->update($request->validated());

        return response()->json([
            'message' => 'Kelas berhasil diperbarui.',
            'data' => new KelasResource($kela->loadCount('santris')),
        ]);
    }

    /**
     * Remove the specified class.
     */
    public function destroy(Kelas $kela): JsonResponse
    {
        $kela->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus.',
        ]);
    }
}
