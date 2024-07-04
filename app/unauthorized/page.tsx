'use client';

export default async function Page() {
  // user is logged in

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Unauthorized!</strong>
        <span className="block sm:inline">
          {' '}
          Wellcome to MIS! You are not yet assigned to any role, you have to
          wait for the Admin to be assigned.
        </span>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-24"
        onClick={() => (window.location.href = '/login')}
      >
        Login
      </button>
    </div>
  );
}
