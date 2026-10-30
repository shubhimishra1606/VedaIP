import { useState } from "react";
import { login, signup } from "../api";

export default function Login({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" ya "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email, password);
        setInfo("Account created. You can login now.");
        setMode("login");
      } else {
        await login(email, password);
        onLoggedIn();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-1">VedaIP</h1>
        <p className="text-sm text-gray-500 mb-5">
          {mode === "login" ? "Login into your account" : "Create a new account"}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {info && <p className="text-sm text-green-600 mb-3">{info}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full bg-green-700 text-white rounded-lg py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-sm text-gray-500 mt-4"
        >
          {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}