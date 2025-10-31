import { useState } from "react";
import Card from "../../components/Card.jsx";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email || !password) return;
    onLogin({ email }); 
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card title={mode === "login" ? "Login" : "Sign up"}>
        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1 text-sm">
            Email
            <input
              className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm">
            Password
            <input
              type="password"
              className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="bg-black text-white rounded py-2 hover:bg-gray-800">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <div className="text-sm mt-3">
          {mode === "login" ? (
            <>No account?{" "}
              <button className="underline" onClick={() => setMode("signup")}>Sign up</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button className="underline" onClick={() => setMode("login")}>Log in</button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
