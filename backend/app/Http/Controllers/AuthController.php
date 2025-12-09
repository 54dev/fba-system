<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LoginLog;

class AuthController extends Controller
{
    // 登录
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => '邮箱或密码错误'], 401);
        }

        $user = Auth::user();

        // 记录登录日志（含 IP）
        LoginLog::create([
            'user_id' => $user->id,
            'ip'      => $request->ip(),
        ]);

        // Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => '登录成功',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    // 获取当前登录用户
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    // 退出登录
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => '已退出'
        ]);
    }
}
