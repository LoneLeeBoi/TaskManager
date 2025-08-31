import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to the Home Page
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your tasks easily with the Task Manager.
        </p>
        <Link
          href="/tasks"
          className="bg-gray-600 text-white px-6 py-3 rounded-2xl shadow-md 
                     hover:bg-gray-800 hover:text-amber-100 transition-colors duration-300"
        >
           Go to Task Manager
        </Link>
      </div>
    </div>
  );
}
