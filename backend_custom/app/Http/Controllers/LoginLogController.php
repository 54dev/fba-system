<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;

class LoginLogController extends Controller
{
    public function index()
    {
        $logs = LoginLog::with('user')
            ->orderByDesc('login_at')
            ->get()
            ->map(function ($log) {
                return [
                    'id'       => $log->id,
                    'user'     => $log->user?->name,
                    'login_at' => $log->login_at,
                ];
            });

        return response()->json($logs);
    }
}
