<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * 用户列表（仅管理员）
     */
    public function index()
    {
        return response()->json([
            'users' => User::select('id', 'name', 'email', 'role', 'created_at')->get()
        ]);
    }

    /**
     * 创建新用户（仅管理员）
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:80',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,reviewer,operator',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '验证失败',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'role'     => $request->role,
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'message' => '用户创建成功',
            'user' => $user
        ]);
    }

    /**
     * 获取用户详情（管理员 & 审核员可查看）
     */
    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'role', 'created_at')->find($id);

        if (!$user) {
            return response()->json(['message' => '用户不存在'], 404);
        }

        return response()->json($user);
    }

    /**
     * 更新用户信息（仅管理员）
     */
    public function update(Request $request, $id)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => '无权限操作'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => '用户不存在'], 404);
        }

        // 验证规则
        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:80',
            'email' => 'required|email|unique:users,email,' . $id,
            'role'  => 'required|in:admin,reviewer,operator',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '验证失败',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 更新
        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            'role'  => $request->role
        ]);

        return response()->json([
            'message' => '用户更新成功',
            'user' => $user
        ]);
    }
}
