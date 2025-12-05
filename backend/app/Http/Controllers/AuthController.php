<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api')->plainTextToken;

        LoginLog::create([
            'user_id' => $user->id,
            'logged_in_at' => now(),
        ]);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(Request $request)
    {
        // 前端只需要删除 localStorage token，因此后端无需执行任何操作
        return response()->json(['message' => 'Logged out']);
    }
}
