export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-10 h-10 border-4 border-t-gray-900 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
}