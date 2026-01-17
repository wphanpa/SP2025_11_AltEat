import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../component/Navbar.tsx";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/profile",
        data: { username },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/signupsuccess");
    }
  };

  return (
    <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
            <div className="bg-white p-8 rounded-xl w-full max-w-md shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    placeholder="Username"
                    className="w-full border px-4 py-2 rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    placeholder="Email"
                    type="email"
                    className="w-full border px-4 py-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="w-full border px-4 py-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    disabled={loading}
                    className="w-full bg-[#e48f75] text-white py-2 rounded hover:bg-[#E6896D]"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
                </form>

                {/*Login */}
                <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-[#ce441a] font-medium">
                    Login
                </Link>
                </p>
            </div>
        </div>
    </>
    
  );
}
