import React, { useState, useEffect } from "react";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/SignUp";
import HomePage from "../components/HomePage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Signup
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is logged in
  const navigate = useNavigate();

  // Get the user's role from localStorage
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    // Check authentication state from localStorage on page load
    const storedAuthState = localStorage.getItem("isAuthenticated");
    if (storedAuthState === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update state when login is successful
    localStorage.setItem("isAuthenticated", "true"); // Persist state in localStorage
  };

  const handleAdminAction = () => {
    navigate("/admin"); // Navigate to admin dashboard
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Update state to log out
    localStorage.removeItem("isAuthenticated"); // Remove authentication state from localStorage
    localStorage.removeItem("token"); // Remove token or other user-related data
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <div className="w-full">
          <div className="flex justify-end p-4">
            {/* Flex container for Admin Action and Log Out buttons */}
            <div className="flex space-x-2">
              {userRole === "admin" && (
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                  onClick={handleAdminAction}
                >
                  Admin Action
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              >
                Log Out
              </button>
            </div>
          </div>
          <HomePage /> {/* Render HomePage if authenticated */}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h1>

          {/* Render Login or SignUp Component */}
          {isLogin ? (
            <Login onLoginSuccess={handleLoginSuccess} /> // Pass callback to Login
          ) : (
            <Signup />
          )}

          {/* Toggle Button */}
          <p className="mt-4 text-sm text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
