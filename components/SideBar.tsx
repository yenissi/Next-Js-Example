"use client";

type View =
  | "products"
  | "authors"
  | "activities"
  | "items"
  | "cart"
  | "videos";

const menu: {
  label: string;
  value: View;
}[] = [
  { label: "Products", value: "products" },
  { label: "Authors", value: "authors" },
  { label: "Activities", value: "activities" },
  { label: "Items", value: "items" },
  { label: "Cart", value: "cart" },
  { label: "Videos", value: "videos" },
];

export default function Sidebar({
  setView,
  open,
  setOpen,
}: {
  setView: (view: View) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64
          bg-gray-900 text-white p-4 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Menu</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl hover:text-gray-300 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <ul className="space-y-2">
          {menu.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                setView(item.value);
                setOpen(false);
              }}
              className="
                p-3 rounded-lg cursor-pointer
                bg-gray-800
                hover:bg-blue-600
                hover:translate-x-1
                transition-all
              "
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}