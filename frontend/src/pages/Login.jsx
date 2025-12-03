import { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError("账号或密码错误");
        }
    };

    return (
        <div>
            <h2>登录</h2>
            {error && <p style={{color:"red"}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input placeholder="邮箱" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="密码" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="submit">登录</button>
            </form>
        </div>
    );
}
