"use client";

export default function Navbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-14 bg-gray-900 text-white flex items-center px-4 z-40 shadow">

      {/* HAMBURGER */}
      <button
        onClick={onOpenSidebar}
        className="text-2xl cursor-pointer hover:scale-110 transition"
      >
        ☰
      </button>

      {/* TITLE */}
      <h1 className="ml-4 font-bold text-lg">
        Dashboard
      </h1>

    </div>
  );
}