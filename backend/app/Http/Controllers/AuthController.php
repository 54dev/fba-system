<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 登录
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // 清掉旧 token，保持一个干净的登录状态
        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        // 创建 Sanctum token
        $token = $user->createToken('fba-token')->plainTextToken;

        // 记录最后登录时间
        $user->last_login_at = now();
        $user->save();

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    // 当前用户信息（给 /api/me 用）
    public function me(Request $request)
    {
        $user = $request->user(); // 由 sanctum 解析 Bearer token

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]);
    }

    // 退出登录
    public function logout(Request $request)
    {
        $user = $request->user();

        // 这里做防御性判断，避免你点多次退出导致 500
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out',
        ]);
    }
}