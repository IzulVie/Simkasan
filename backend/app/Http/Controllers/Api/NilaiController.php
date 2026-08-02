<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NilaiRequest;
use App\Http\Resources\NilaiResource;
use App\Models\Nilai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NilaiController extends Controller
{
    /**
     * Display a listing of grades.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Nilai::with(['santri', 'ustadz']);

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
            if ($request->has('santri_id')) {
                $query->where('santri_id', $request->santri_id);
            }
        }

        $nilais = $query->orderBy('tanggal', 'desc')->orderBy('created_at', 'desc')->get();

        return NilaiResource::collection($nilais);
    }

    /**
     * Store a newly created grade.
     */
    public function store(NilaiRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['ustadz_id'] = auth()->id();

        $nilai = Nilai::create($data);

        return response()->json([
            'message' => 'Nilai akademik berhasil ditambahkan.',
            'data' => new NilaiResource($nilai->load(['santri', 'ustadz'])),
        ], 201);
    }

    /**
     * Display the specified grade.
     */
    public function show(Nilai $nilai): NilaiResource
    {
        return new NilaiResource($nilai->load(['santri', 'ustadz']));
    }

    /**
     * Update the specified grade.
     */
    public function update(NilaiRequest $request, Nilai $nilai): JsonResponse
    {
        $data = $request->validated();
        $nilai->update($data);

        return response()->json([
            'message' => 'Nilai akademik berhasil diperbarui.',
            'data' => new NilaiResource($nilai->load(['santri', 'ustadz'])),
        ]);
    }

    /**
     * Remove the specified grade.
     */
    public function destroy(Nilai $nilai): JsonResponse
    {
        $nilai->delete();

        return response()->json([
            'message' => 'Nilai akademik berhasil dihapus.',
        ]);
    }
}
