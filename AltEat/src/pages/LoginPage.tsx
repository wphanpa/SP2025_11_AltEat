import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../component/Navbar.tsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/profile");
    }
  };

  return (
    <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
            
            <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e48f75] text-white py-2 rounded hover:bg-[#E6896D] transition disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                </form>

                {/*Sign Up */}
                <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-[#ce441a] font-medium">
                    Sign up
                </Link>
                </p>
            </div>
        </div>
    </>
    
  );
}
