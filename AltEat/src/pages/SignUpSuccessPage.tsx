import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar.tsx";

function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
            <h1 className="text-2xl font-bold text-[#ce441a] mb-4">
            🎉 Sign up successful!
            </h1>

            <p className="text-gray-600">
            Your account has been created successfully.
            </p>

            <p className="text-sm text-gray-400 mt-4">
            You can now start using the application.
            </p>

            <button
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-[#e48f75] text-white py-2 rounded hover:bg-[#E6896D] transition"
            >
            Go to Home
            </button>
        </div>
        </div>
    </>
  );
}

export default SignupSuccess;
