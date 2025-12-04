<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;

class LoginLogController extends Controller
{
    public function index()
    {
        $logs = LoginLog::with('user')
            ->orderBy('logged_in_at', 'desc')
            ->get();

        return response()->json($logs);
    }
}
