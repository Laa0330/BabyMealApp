import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./features/auth/Auth.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Feeding from "./pages/Feeding.jsx";
import "./index.css";

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial ?? null;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}

export default function App() {
  const [user, setUser] = useLocalState("user", null);
  const nav = useNavigate();

  function handleLogin({ email }) {
    setUser({ email });
    nav("/app");
  }
  function handleLogout() {
    setUser(null);
  }

  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/" element={<Auth onLogin={handleLogin} />} />

      {/* Private: wrap bằng ProtectedRoute */}
      <Route
        path="/app"
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/feeding"
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Feeding />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Auth onLogin={handleLogin} />} />
    </Routes>
  );
}
