<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AbsensiRequest;
use App\Http\Resources\AbsensiResource;
use App\Models\Absensi;
use App\Models\Santri;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    /**
     * Display a listing of the attendance records.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Absensi::with(['santri', 'pencatat']);

        // Check if user is parent (wali)
        if (auth()->user()->hasRole('wali')) {
            $wali = auth()->user()->waliProfile;
            if ($wali) {
                $studentIds = $wali->santris->pluck('id');
                $query->whereIn('santri_id', $studentIds);
            } else {
                $query->whereRaw('1 = 0'); // Empty result if no profile
            }
        } else {
            // Admin/Ustadz can filter by kelas_id
            if ($request->has('kelas_id')) {
                $query->whereHas('santri', function ($q) use ($request) {
                    $q->where('kelas_id', $request->kelas_id);
                });
            }
        }

        if ($request->has('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        if ($request->has('sesi')) {
            $query->where('sesi', $request->sesi);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        // Order by date descending, session ascending
        $absensi = $query->orderBy('tanggal', 'desc')->orderBy('sesi', 'asc')->get();

        return AbsensiResource::collection($absensi);
    }

    /**
     * Store or update bulk attendance logs.
     */
    public function store(AbsensiRequest $request): JsonResponse
    {
        $data = $request->validated();
        $stored = [];

        DB::transaction(function () use ($data, &$stored) {
            foreach ($data['items'] as $item) {
                $stored[] = Absensi::updateOrCreate(
                    [
                        'santri_id' => $item['santri_id'],
                        'tanggal' => $data['tanggal'],
                        'sesi' => $data['sesi'],
                    ],
                    [
                        'status' => $item['status'],
                        'keterangan' => $item['keterangan'] ?? null,
                        'dicatat_oleh' => auth()->id(),
                    ]
                );
            }
        });

        return response()->json([
            'message' => 'Absensi berhasil disimpan.',
            'data' => AbsensiResource::collection(collect($stored)->load(['santri', 'pencatat'])),
        ]);
    }

    /**
     * Get attendance recap grouped by student and status.
     */
    public function rekap(Request $request): JsonResponse
    {
        $query = Absensi::query();

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
            if ($request->has('kelas_id')) {
                $query->whereHas('santri', function ($q) use ($request) {
                    $q->where('kelas_id', $request->kelas_id);
                });
            }
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        // Group by student and status
        $rekap = $query->select('santri_id', 'status', DB::raw('count(*) as total'))
            ->groupBy('santri_id', 'status')
            ->get();

        $santris = Santri::whereIn('id', $rekap->pluck('santri_id')->unique())->get()->keyBy('id');

        $result = [];
        foreach ($rekap->groupBy('santri_id') as $santriId => $items) {
            $santri = $santris->get($santriId);
            if (! $santri) {
                continue;
            }

            $counts = [
                'hadir' => 0,
                'izin' => 0,
                'sakit' => 0,
                'alpha' => 0,
                'terlambat' => 0,
            ];

            foreach ($items as $item) {
                if (array_key_exists($item->status, $counts)) {
                    $counts[$item->status] = $item->total;
                }
            }

            $totalSesi = array_sum($counts);

            $result[] = [
                'santri_id' => $santriId,
                'nama' => $santri->nama,
                'nis' => $santri->nis,
                'rekap' => $counts,
                'total_sesi' => $totalSesi,
                'persentase_kehadiran' => $totalSesi > 0
                    ? round((($counts['hadir'] + $counts['terlambat']) / $totalSesi) * 100, 1)
                    : 100,
            ];
        }

        return response()->json([
            'data' => $result,
        ]);
    }
}
