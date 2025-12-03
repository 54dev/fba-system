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
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        /** @var User|null $user */
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 更新最后登录时间
        $user->last_login_at = now();
        $user->save();

        // 写登录日志
        LoginLog::create([
            'user_id'    => $user->id,
            'login_time' => now(),
        ]);

        // Sanctum 生成 token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        // 删除当前 token
        $user->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
