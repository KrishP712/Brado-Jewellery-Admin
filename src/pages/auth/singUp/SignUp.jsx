// components/SignUpForm.jsx
import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Brado Jewellery
                    </h1>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="admin@brado.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signin" className="text-gray-800 hover:text-gray-900 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
