import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/auth/login`, loginData);
        localStorage.setItem("token", res.data.token);
        setMessage("Welcome back! Redirecting...");
        setIsLoginOpen(false);
        setLoading(true);

        // Redirect after 1 second so user sees the message
        setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
        console.log(error);
        setMessage(error.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
        const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/auth/register`, {
            fullName: signupData.fullName,
            email: signupData.email,
            password: signupData.password,
        });
        localStorage.setItem("token", res.data.token);
        setMessage(`Account created for ${res.data.user.name}. Redirecting...`);
        setIsSignupOpen(false);
        setLoading(true);

        setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
        console.log(error);
        setMessage(error.response?.data?.message || "Signup failed");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-6">

      {/* Display message */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-green-600 rounded-lg text-white">
          {message}
        </div>
      )}
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg mb-10 text-gray-300">
          A secure and scalable web application with authentication, dashboard, and powerful features.  
          Start your journey today 🚀
        </p>

        <div className="space-x-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-8 py-3 rounded-full hover:cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold hover:opacity-90 transition shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => setIsSignupOpen(true)}
            className="px-8 py-3 rounded-full hover:cursor-pointer bg-gradient-to-r from-yellow-300 to-orange-400 font-semibold hover:opacity-90 transition shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-96 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
            <form className="space-y-5" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:cursor-pointer font-semibold hover:opacity-90 transition"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setIsLoginOpen(false)}
              className="mt-6 w-full text-center text-sm text-gray-300 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-96 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Sign Up</h2>
            <form className="space-y-5" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                className="w-full p-3 bg-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-300 to-orange-400 hover:cursor-pointer font-semibold hover:opacity-90 transition"
              >
                {loading ? 'Loading...' : 'Create Account'}
              </button>
            </form>
            <button
              onClick={() => setIsSignupOpen(false)}
              className="mt-6 w-full text-center text-sm text-gray-300 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
