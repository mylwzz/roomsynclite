// src/app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";

interface AdminUser {
  userId:   string;
  email:    string;
  name?:    string;
  age?:     number;
  gender?:  string;
  role?:    string;
  location?:string;
}

export default function AdminPage() {
  const [users,    setUsers]    = useState<AdminUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editingId,setEditing]  = useState<string | null>(null);
  // 👇 here's the correction: balance your angle‑brackets and parens
  const [form,     setForm]     = useState<Partial<Omit<AdminUser, 'userId' | 'email'>>>({});

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: AdminUser[]) => setUsers(data))
      .catch((e) => console.error("Failed to load users", e))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (u: AdminUser) => {
    setEditing(u.userId);
    setForm({ name: u.name, age: u.age, role: u.role, location: u.location });
  };
  const cancelEdit = () => { setEditing(null); setForm({}); };

  const saveEdit = async () => {
    if (!editingId) return;
    const res = await fetch(`/api/admin/users/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await fetch("/api/admin/users").then((r) => r.json());
      setUsers(updated);
      cancelEdit();
    } else {
      console.error(`Failed to save user ${editingId}`, res.status);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Really delete?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((u) => u.filter((x) => x.userId !== userId));
    } else {
      console.error(`Failed to delete ${userId}`, res.status);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th>Email</th><th>Name</th><th>Age</th><th>Role</th><th>Location</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId} className="border-t">
              <td className="px-2 py-1">{u.email}</td>
              <td className="px-2 py-1">
                {editingId === u.userId ? (
                  <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded px-1"
                  />
                ) : u.name}
              </td>
              <td className="px-2 py-1">
                {editingId === u.userId ? (
                  <input
                    type="number"
                    value={form.age?.toString() || ""}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="border rounded px-1 w-16"
                  />
                ) : u.age}
              </td>
              <td className="px-2 py-1">
                {editingId === u.userId ? (
                  <select
                    value={form.role || ""}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="border rounded px-1"
                  >
                    <option>looking</option>
                    <option>offering</option>
                    <option>browsing</option>
                    <option>admin</option>
                  </select>
                ) : u.role}
              </td>
              <td className="px-2 py-1">
                {editingId === u.userId ? (
                  <input
                    type="text"
                    value={form.location || ""}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="border rounded px-1"
                  />
                ) : (u.location || "—")}
              </td>
              <td className="px-2 py-1 space-x-1">
                {editingId === u.userId ? (
                  <>
                    <button onClick={saveEdit} className="text-green-600">Save</button>
                    <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)} className="text-blue-600">Edit</button>
                    <button onClick={() => deleteUser(u.userId)} className="text-red-600">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}