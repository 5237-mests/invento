"use client";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const signup = (data: FormData) => {
    const firstName = data.get("firstName")?.valueOf();
    const lastName = data.get("lastName")?.valueOf();
    const username = data.get("username")?.valueOf();
    const email = data.get("email")?.valueOf();
    const phone = data.get("phone")?.valueOf();
    const password = data.get("password")?.valueOf();

    //check if all fields are filled
    if (!firstName || !lastName || !username || !email || !password || !phone) {
      setError({
        ...error,
        firstName: !firstName ? "First name is required" : "",
        lastName: !lastName ? "Last name is required" : "",
        username: !username ? "Username is required" : "",
        email: !email ? "Email is required" : "",
        phone: !phone ? "Phone is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    } else {
      setError({
        ...error,
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });
    }

    //validate password
    if (password.length < 6) {
      setError({
        ...error,
        password: "Password must be at least 6 characters*",
      });
      return;
    }

    //send data to server
    const sendData = async () => {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          phone,
          password,
        }),
      });

      // if error
      if (res.status === 400) {
        toast({
          title: "Error",
          description: "Missing fields",
          variant: "destructive",
        });
      }
      // if user exists
      if (res.status === 409) {
        toast({
          title: "Error",
          description: "User already exists",
          variant: "destructive",
        });
      }

      // if user created
      if (res.status === 201) {
        toast({
          title: "Success",
          description: "User created successfully",
        });
        // redirect to login
        router.push("/login");
      }
    };

    sendData();
  };
  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-slate-700 p-8 rounded-lg shadow-md lg:w-4/12 hover:shadow-2xl mt-3">
        <form
          className="space-y-2 flex flex-col"
          style={{ gap: "1rem" }}
          action={signup}
        >
          <div className="flex flex-col ">
            <label htmlFor="firstName">First Name</label>
            <span className="text-red-500">{error.firstName}</span>
            <input
              type="text"
              placeholder="First Name*"
              name="firstName"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, firstName: "" })}
              required
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="lastName">Last Name</label>
            <span className="text-red-500">{error.lastName}</span>
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, lastName: "" })}
              required
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="username">Username</label>
            <span className="text-red-500">{error.username}</span>
            <input
              type="text"
              placeholder="Username*"
              required
              name="username"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, username: "" })}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="email">Email</label>
            <span className="text-red-500">{error.email}</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, email: "" })}
            />
          </div>
          {/* phone number */}
          <div className="flex flex-col ">
            <label htmlFor="phone">Phone</label>
            <span className="text-red-500">{error.phone}</span>
            <input
              type="text"
              placeholder="099 999 9999"
              name="phone"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, phone: "" })}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="password">Password</label>
            <span className="text-red-500">{error.password}</span>
            <input
              type="password"
              placeholder="Password*"
              required
              name="password"
              className="border border-gray-300 rounded px-4 py-2 text-slate-600 focus:outline-slate-400"
              onChange={(e) => setError({ ...error, password: "" })}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
          <p className="text-center">
            Already have an account?
            <Link href="/login" className="text-blue-500 pl-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
