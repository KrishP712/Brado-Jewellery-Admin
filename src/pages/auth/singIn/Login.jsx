import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminlogin, clearError, clearSuccess } from "../../../Redux/slice/adminauth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const hasRedirected = useRef(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, isError, isAuthenticated, successMessage } = useSelector(
        (state) => state.admin
    );

    // Check if already authenticated on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    // Handle redirect after successful login
    useEffect(() => {
        if (isAuthenticated && successMessage && !hasRedirected.current) {
            hasRedirected.current = true;
            const timer = setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, successMessage, navigate]);

    // Clear messages after showing them
    useEffect(() => {
        if (successMessage || isError) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
                dispatch(clearError());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, isError, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(adminlogin({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Brado Jewellery
                    </h1>
                    <p className="text-gray-600 mt-2">Admin Login</p>
                </div>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        {successMessage}
                    </div>
                )}
                {isError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {typeof isError === 'string' ? isError : isError.message || 'Login failed'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="admin@brado.com"
                            autoComplete="email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;