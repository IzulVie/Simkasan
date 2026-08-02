<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SantriRequest;
use App\Http\Resources\SantriResource;
use App\Models\Santri;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SantriController extends Controller
{
    /**
     * Display a listing of santris.
     */
    public function index(): AnonymousResourceCollection
    {
        $santris = Santri::with('kelas')->get();

        return SantriResource::collection($santris);
    }

    /**
     * Store a newly created santri.
     */
    public function store(SantriRequest $request): JsonResponse
    {
        $santri = Santri::create($request->validated());

        return response()->json([
            'message' => 'Santri berhasil ditambahkan.',
            'data' => new SantriResource($santri->load('kelas')),
        ], 201);
    }

    /**
     * Display the specified santri.
     */
    public function show(Santri $santri): SantriResource
    {
        return new SantriResource($santri->load('kelas'));
    }

    /**
     * Update the specified santri.
     */
    public function update(SantriRequest $request, Santri $santri): JsonResponse
    {
        $santri->update($request->validated());

        return response()->json([
            'message' => 'Santri berhasil diperbarui.',
            'data' => new SantriResource($santri->load('kelas')),
        ]);
    }

    /**
     * Remove the specified santri.
     */
    public function destroy(Santri $santri): JsonResponse
    {
        $santri->delete();

        return response()->json([
            'message' => 'Santri berhasil dihapus.',
        ]);
    }
}
