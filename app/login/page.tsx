'use client';
import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import navigate from './action'; // Ensure this function is properly defined

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      await navigate(formData);
    } catch (err) {
      setError('Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-slate-700 p-8 rounded-lg shadow-md hover:shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>

          <div>
            <p className="text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/registrations"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
