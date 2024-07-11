'use client';
import { useToast } from '@/components/ui/use-toast';
import React, { useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';

export default function Page() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  const { toast } = useToast();

  // error state
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  // write onChange handler
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    // reset error
    setError({
      ...error,
      [e.target.name]: '',
    });
  };

  const createUser = async (e: FormEvent) => {
    e.preventDefault();

    // check if all fields are filled
    if (
      !user.firstName ||
      !user.lastName ||
      !user.username ||
      !user.email ||
      !user.password ||
      !user.role
    ) {
      toast({
        description: 'All fields are required',
      });
      return;
    }

    // create user
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast({
          description: 'User created successfully',
        });
      } else if (res.status === 409) {
        if (data.field === 'email') {
          setError({
            ...error,
            email: data.msg,
          });
        } else if (data.field === 'username') {
          setError({
            ...error,
            username: data.msg,
          });
        }
      } else if (res.status === 400) {
        if (data.field === 'password') {
          setError({
            ...error,
            password: data.msg,
          });
        }
      }
    } catch (err) {
      console.log(err);
      toast({
        description: 'An error occurred while creating the user',
      });
    }
  };

  return (
    <div className="ml-7 text-slate-950">
      <h1 className="text-2xl font-bold py-6">Create User</h1>
      <hr />
      <div>
        <div className="flex justify-between py-1">
          <form className="w-full max-w-lg" onSubmit={createUser}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-first-name"
                  type="text"
                  name="firstName"
                  placeholder="Jane"
                  onChange={onChange}
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                {error.username && (
                  <p className="text-red-500">{error.username}</p>
                )}
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                {error.email && <p className="text-red-500">{error.email}</p>}
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                {error.phone && <p className="text-red-500">{error.phone}</p>}
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                {error.password && (
                  <p className="text-red-500">{error.password}</p>
                )}
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="******************"
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* include user role [admin, user, storekeeper, shopkeeper] */}
            <div className="flex flex-wrap -mx-3 mb-6 gap-7">
              <div>
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  onChange={onChange}
                  required
                />
                <label htmlFor="admin" className="ml-2">
                  Admin
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="storekeeper"
                  name="role"
                  value="storekeeper"
                  onChange={onChange}
                  required
                />
                <label htmlFor="storekeeper" className="ml-2">
                  Storekeeper
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="shopkeeper"
                  name="role"
                  value="shopkeeper"
                  onChange={onChange}
                  required
                />
                <label htmlFor="shopkeeper" className="ml-2">
                  Shopkeeper
                </label>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Create User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
