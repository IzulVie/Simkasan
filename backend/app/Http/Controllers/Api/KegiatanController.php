<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\KegiatanRequest;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class KegiatanController extends Controller
{
    /**
     * Display a listing of activities.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Kegiatan::query();

        if ($request->has('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $kegiatans = $query->orderBy('tanggal', 'asc')->orderBy('waktu', 'asc')->get();

        return KegiatanResource::collection($kegiatans);
    }

    /**
     * Store a newly created activity.
     */
    public function store(KegiatanRequest $request): JsonResponse
    {
        $kegiatan = Kegiatan::create($request->validated());

        return response()->json([
            'message' => 'Kegiatan / jadwal berhasil ditambahkan.',
            'data' => new KegiatanResource($kegiatan),
        ], 201);
    }

    /**
     * Display the specified activity.
     */
    public function show(Kegiatan $kegiatan): KegiatanResource
    {
        return new KegiatanResource($kegiatan);
    }

    /**
     * Update the specified activity.
     */
    public function update(KegiatanRequest $request, Kegiatan $kegiatan): JsonResponse
    {
        $kegiatan->update($request->validated());

        return response()->json([
            'message' => 'Kegiatan / jadwal berhasil diperbarui.',
            'data' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Remove the specified activity.
     */
    public function destroy(Kegiatan $kegiatan): JsonResponse
    {
        $kegiatan->delete();

        return response()->json([
            'message' => 'Kegiatan / jadwal berhasil dihapus.',
        ]);
    }
}
