"use client";

import { useEffect, useState } from "react";
import { fetchUsers } from "@/services/users-service";
import type { User } from "@/types/user";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();

        setUsers(data);

        setError(null);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // LOADING
  if (loading) {
    return <LoadingSpinner />;
  }

  // ERROR
  if (error) {
    return (
      <p className="text-red-500 text-lg fixed inset-0 flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6">
      
      {/* TITLE */}
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      {/* USERS LIST */}
      <ul className="space-y-3 max-w-2xl mx-auto">
        {users.map((u) => (
          <li
            key={u.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <p className="font-semibold">{u.name}</p>

            <p className="text-gray-600 text-sm">
              {u.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}