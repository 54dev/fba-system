import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../api";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator"
  });

  const load = async () => {
    const res = await fetchUsers();
    setUsers(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(form);
    setForm({ name: "", email: "", password: "", role: "operator" });
    load();
  };

  return (
    <div>
      <h2>用户管理</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="姓名" value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="邮箱" value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input placeholder="密码" type="password" value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="operator">操作员</option>
          <option value="reviewer">审核员</option>
          <option value="admin">管理员</option>
        </select>

        <button type="submit">创建用户</button>
      </form>

      <hr />

      <h3>用户列表</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} - {u.email} - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}
