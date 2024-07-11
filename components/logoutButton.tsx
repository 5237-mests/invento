'use client';
import logout from '@/lib/logout';
export default function LogoutButton() {
  return (
    <button
      onClick={logout}
      className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}
