import { Link, useNavigate } from "react-router-dom";

export default function Layout({ user, onLogout, children }) {
  const nav = useNavigate();
  return (
    <div>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Baby Meal Feeding Tracker</h1>
          <nav className="flex items-center gap-4">
            <Link className="hover:underline" to="/app"> Dashboard </Link>
            <Link className="hover:underline" to="/feeding"> Feeding Log </Link>
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => { onLogout(); nav("/"); }}
              className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}