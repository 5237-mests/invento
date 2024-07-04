"use client";
// create dynamic page for user
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<any>();
  //  want to do crud on User model for admin purpose
  // get user by id

  useEffect(() => {
    fetch(`/api/user/?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.log(err));
  }, []);

  // delete user
  const deleteUser = () => {
    fetch("/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: params.id }),
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-4 ml-3 w-full h-screen">
      <h1 className="text-slate-950">User Details</h1>
      <hr className="my-2 text-slate-950 size-1" />
      <div className="user-info">
        <div className="flex justify-between py-1 text-slate-950">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/admin/user/${params.id}/edit`)}
          >
            Edit
          </button>
          <button
            onClick={() => deleteUser()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            delete user
          </button>
        </div>
        <form action="" className="text-slate-950">
          <div className="py-1 mt-5">
            <p className="font-thin">First Name</p>
            <p>{user && user.firstName}</p>
          </div>

          <div className="py-1 mt-3">
            <p className="font-thin">Last Name</p>
            <p>{user && user.lastName}</p>
          </div>

          <div className="py-1 mt-3">
            <p className="font-thin">Email</p>
            <p>{user && user.email}</p>
          </div>

          <div className="py-1 mt-3">
            <p className="font-thin">Password</p>
            <p>{user && user.password}</p>
          </div>

          <div className="py-1 mt-3">
            <p className="font-thin">Phone</p>
            <p>{user && user.phone}</p>
          </div>

          <div className="py-1 mt-3">
            <p className="font-thin">Role</p>
            <p>{user && user.role}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
