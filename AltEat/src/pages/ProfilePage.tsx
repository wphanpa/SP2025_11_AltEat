import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../component/Navbar.tsx";

export default function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login"); 
        return;
      }

      setEmail(data.user.email || "");
      setUsername(data.user.user_metadata.username || "");
    }
    loadUser();
  }, [navigate]);

  const updateProfile = async () => {
    setMessage("");

    if (username) {
      await supabase.auth.updateUser({
        data: { username },
      });
    }

    if (password) {
      await supabase.auth.updateUser({
        password,
      });
      setPassword("");
    }

    setMessage("Profile updated successfully");
  };

  //SIGN OUT
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
       <Navbar />
       <button
            onClick={() => navigate("/")}
            className="fixed top-20 left-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow hover:bg-white transition"
        >
            ← Back
        </button>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
            <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                <label className="block mb-2 text-sm">Email</label>
                <input
                disabled
                value={email}
                className="w-full border px-4 py-2 rounded mb-4 bg-gray-100"
                />

                <label className="block mb-2 text-sm">Username</label>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
                />

                <label className="block mb-2 text-sm">New Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
                />

                {message && (
                <p className="text-green-600 text-sm mb-3">{message}</p>
                )}

                <button
                onClick={updateProfile}
                className="w-full bg-[#e48f75] text-white py-2 rounded hover:bg-[#E6896D] mb-4"
                >
                Save Changes
                </button>

                {/*Sign Out */}
                <button
                onClick={handleSignOut}
                className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
                >
                Sign Out
                </button>
            </div>
        </div>
    </>
    
  );
}
