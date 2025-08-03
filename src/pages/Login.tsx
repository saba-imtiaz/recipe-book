import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md relative">
        <Link to="/" className="absolute -top-10 left-0 text-sm text-black hover:underline">
          ← Back to Home
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="px-3 py-1 rounded bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold text-lg shadow">
              R
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to access your recipes</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?
        </p>
        <p className="text-sm font-medium text-center">
          <Link
            to="/Register"
            className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent hover:underline"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
