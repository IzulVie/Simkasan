<?php

use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HafalanController;
use App\Http\Controllers\Api\KegiatanController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\NilaiController;
use App\Http\Controllers\Api\SantriController;
use App\Http\Controllers\Api\WaliSantriController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Shared read-only routes
    Route::get('/absensi', [AbsensiController::class, 'index']);
    Route::get('/absensi/rekap', [AbsensiController::class, 'rekap']);
    Route::get('/hafalan', [HafalanController::class, 'index']);
    Route::get('/nilai', [NilaiController::class, 'index']);
    Route::get('/kegiatan', [KegiatanController::class, 'index']);

    // Admin & Ustadz routes (Write access)
    Route::middleware('role:admin|ustadz')->group(function () {
        Route::post('/absensi', [AbsensiController::class, 'store']);

        // CRUD Write operations
        Route::apiResource('/hafalan', HafalanController::class)->except(['index']);
        Route::apiResource('/nilai', NilaiController::class)->except(['index']);
        Route::apiResource('/kegiatan', KegiatanController::class)->except(['index']);
    });

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/users', [AuthController::class, 'usersIndex']);
        Route::put('/users/{user}', [AuthController::class, 'usersUpdate']);
        Route::delete('/users/{user}', [AuthController::class, 'usersDestroy']);

        // Master Data CRUD
        Route::apiResource('/kelas', KelasController::class);
        Route::apiResource('/santris', SantriController::class);
        Route::apiResource('/wali-santris', WaliSantriController::class);
    });
});
