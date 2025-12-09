<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            "data" => User::orderBy("id", "desc")->get()
        ]);
    }

    public function show($id)
    {
        return response()->json([
            "data" => User::findOrFail($id)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users,email",
            "password" => "required|min:3",
            "role" => ["required", Rule::in(["admin", "reviewer", "operator"])],
        ]);

        $validated["password"] = Hash::make($validated["password"]);

        $user = User::create($validated);

        return response()->json([
            "message" => "用户创建成功",
            "data" => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            "name" => "required",
            "email" => ["required", "email", Rule::unique("users")->ignore($id)],
            "role" => ["required", Rule::in(["admin", "reviewer", "operator"])],
            "password" => "nullable|min:3",
        ]);

        if (!empty($validated["password"])) {
            $validated["password"] = Hash::make($validated["password"]);
        } else {
            unset($validated["password"]);
        }

        $user->update($validated);

        return response()->json([
            "message" => "用户信息已更新",
            "data" => $user
        ]);
    }
}
