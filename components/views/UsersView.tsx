"use client";

import { useEffect, useState } from "react";
import { fetchUsers } from "@/services/users-service";
import type { User } from "@/types/user";

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsers();
      setUsers(data);
    }

    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
      </div>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="p-2 bg-gray-100 rounded">
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}