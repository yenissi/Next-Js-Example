"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Navbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    localStorage.removeItem("currentUser");
    // Dispatch custom event to notify page component
    window.dispatchEvent(new Event("logout"));
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-14 bg-gray-900 text-white flex items-center px-4 z-40 shadow justify-between">

      {/* HAMBURGER */}
      <button
        onClick={onOpenSidebar}
        className="text-2xl cursor-pointer hover:scale-110 transition"
      >
        ☰
      </button>

      {/* USER INFO AND LOGOUT */}
      <div className="flex items-center gap-4">
        {userName && (
          <span className="text-sm text-gray-300">
            Welcome, <span className="font-semibold">{userName}</span>
          </span>
        )}
        <button
          onClick={handleLogoutClick}
          className="p-2 cursor-pointer hover:bg-red-600 text-white rounded transition"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800 shadow-xl max-w-sm">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}