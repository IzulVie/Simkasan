<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IuranRequest;
use App\Http\Resources\IuranResource;
use App\Models\Iuran;
use App\Models\Santri;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IuranController extends Controller
{
    /**
     * Display a listing of iuran records.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Iuran::with(['santri.kelas', 'konfirmator']);

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
            // Admin / Staff filtering
            if ($request->has('santri_id') && $request->santri_id) {
                $query->where('santri_id', $request->santri_id);
            }

            if ($request->has('kelas_id') && $request->kelas_id) {
                $query->whereHas('santri', function ($q) use ($request) {
                    $q->where('kelas_id', $request->kelas_id);
                });
            }

            if ($request->has('bulan') && $request->bulan) {
                $query->where('bulan', $request->bulan);
            }

            if ($request->has('tahun') && $request->tahun) {
                $query->where('tahun', $request->tahun);
            }

            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }
        }

        $iurans = $query->orderBy('tahun', 'desc')
                        ->orderBy('bulan', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->get();

        return IuranResource::collection($iurans);
    }

    /**
     * Generate bulk empty iurans for a specific month and year.
     */
    public function generate(IuranRequest $request): JsonResponse
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Hanya administrator yang dapat melakukan aksi ini.'], 403);
        }

        $validated = $request->validated();
        
        $studentQuery = Santri::query();
        if (isset($validated['kelas_id']) && $validated['kelas_id']) {
            $studentQuery->where('kelas_id', $validated['kelas_id']);
        }

        $students = $studentQuery->get();
        if ($students->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data santri untuk men-generate iuran.'], 400);
        }

        $generatedCount = 0;
        foreach ($students as $student) {
            $iuran = Iuran::firstOrCreate([
                'santri_id' => $student->id,
                'bulan' => $validated['bulan'],
                'tahun' => $validated['tahun'],
            ], [
                'status' => 'belum_lunas',
            ]);

            if ($iuran->wasRecentlyCreated) {
                $generatedCount++;
            }
        }

        return response()->json([
            'message' => "Berhasil men-generate $generatedCount iuran baru dengan status Belum Lunas.",
        ], 201);
    }

    /**
     * Mark the specified iuran as Paid (Lunas).
     */
    public function lunas(Request $request, int $id): JsonResponse
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Hanya administrator yang dapat melakukan aksi ini.'], 403);
        }

        $iuran = Iuran::findOrFail($id);

        $iuran->update([
            'status' => 'lunas',
            'dikonfirmasi_oleh' => auth()->id(),
            'tanggal_konfirmasi' => now(),
            'keterangan' => $request->keterangan ?? $iuran->keterangan,
        ]);

        return response()->json([
            'message' => 'Iuran berhasil ditandai Lunas.',
            'data' => new IuranResource($iuran->load(['santri.kelas', 'konfirmator'])),
        ], 200);
    }
}
