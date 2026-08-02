<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HafalanRequest;
use App\Http\Resources\HafalanResource;
use App\Models\Hafalan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HafalanController extends Controller
{
    /**
     * Display a listing of memorization records.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Hafalan::with(['santri', 'ustadz']);

        // Check if user is parent (wali)
        if (auth()->user()->hasRole('wali')) {
            $wali = auth()->user()->waliProfile;
            if ($wali) {
                $studentIds = $wali->santris->pluck('id');
                $query->whereIn('santri_id', $studentIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        } else {
            // Admin / Ustadz filter by santri_id
            if ($request->has('santri_id')) {
                $query->where('santri_id', $request->santri_id);
            }
        }

        $hafalans = $query->orderBy('tanggal', 'desc')->orderBy('created_at', 'desc')->get();

        return HafalanResource::collection($hafalans);
    }

    /**
     * Store a newly created memorization log.
     */
    public function store(HafalanRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['ustadz_id'] = auth()->id();

        $hafalan = Hafalan::create($data);

        return response()->json([
            'message' => 'Catatan setoran hafalan berhasil ditambahkan.',
            'data' => new HafalanResource($hafalan->load(['santri', 'ustadz'])),
        ], 201);
    }

    /**
     * Display the specified memorization log.
     */
    public function show(Hafalan $hafalan): HafalanResource
    {
        return new HafalanResource($hafalan->load(['santri', 'ustadz']));
    }

    /**
     * Update the specified memorization log.
     */
    public function update(HafalanRequest $request, Hafalan $hafalan): JsonResponse
    {
        $data = $request->validated();
        $hafalan->update($data);

        return response()->json([
            'message' => 'Catatan setoran hafalan berhasil diperbarui.',
            'data' => new HafalanResource($hafalan->load(['santri', 'ustadz'])),
        ]);
    }

    /**
     * Remove the specified memorization log.
     */
    public function destroy(Hafalan $hafalan): JsonResponse
    {
        $hafalan->delete();

        return response()->json([
            'message' => 'Catatan setoran hafalan berhasil dihapus.',
        ]);
    }
}
