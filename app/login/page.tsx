"use client";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import navigate from "./action";
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(" ");
  const { toast } = useToast();
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   if (!email || !password) {
  //     toast({
  //       title: 'Error',
  //       description: 'Please enter email and password',
  //       variant: 'destructive',
  //     })
  //     return
  //   }

  //   const response = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email, password }),
  //   })

  //   if (response.ok) {
  //     toast({
  //       title: 'Success',
  //       description: 'Login successful',
  //     })
  //     // store token in local storage
  //     const data = await response.json()
  //     localStorage.setItem('user', JSON.stringify(data))

  //     // write route depending on the role
  //     if (data.user.role === 'admin') {
  //       router.push('/')
  //     } else if (data.user.role === 'storekeeper') {
  //       router.push('/storekeeper')
  //     } else if (data.user.role === 'shopkeeper') {
  //       router.push('/shopkeeper')
  //     } else {
  //       router.push('/unauthorized')
  //     }

  //   } else {
  //     toast({
  //       title: 'Error',
  //       description: 'Invalid email or password',
  //       variant: 'destructive',
  //     })
  //   }
  // }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-slate-700 p-8 rounded-lg shadow-md hover:shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form
          className="space-y-4"
          // onSubmit={handleSubmit}
          action={navigate}
        >
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
              Don&apos;t have an account?{" "}
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
