'use client';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChangeEvent, FormEvent } from 'react';

export default function Page() {
  const [userwork, setUserwork] = useState('');

  const [shopOrStore, setShopOrStore] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    workAt: '',
    onModel: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    // fetch shops or stores according to userwork
    const fetchShopsORStores = async () => {
      if (userwork === 'shop') {
        // fetch shops
        const shops = await axios.get('/api/shop');
        setShopOrStore(shops.data.shops);
      } else if (userwork === 'store') {
        // fetch stores
        const stores = await axios.get('/api/store');
        setShopOrStore(stores.data.stores);
      }
    };

    fetchShopsORStores();
  }, [userwork]);

  // error state
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    workAt: '',
  });

  // write onChange handler
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    user.onModel =
      userwork === 'shop' ? 'Shop' : userwork === 'store' ? 'Store' : '';

    // console.log(user);
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
      <h1 className="text-2xl font-bold py-2">Create User</h1>
      <div className="py-2">
        <select
          onChange={(e) => setUserwork(e.target.value)}
          name="type"
          className="p-2 bg-transparent border border-gray-200 rounded"
        >
          <option value="">Select User work</option>
          <option value="store">STORE</option>
          <option value="shop">SHOP</option>
        </select>
      </div>
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="*************"
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="py-2 w-full my-2">
              <select
                onChange={onChange}
                name="workAt"
                className="p-2 bg-transparent w-full border border-gray-200 rounded"
              >
                <option value="">Select User work place</option>
                {shopOrStore?.map(
                  (shopstore: { _id: string; name: string }) => (
                    <option key={shopstore._id} value={shopstore._id}>
                      {shopstore.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* include user role [admin, user, storekeeper, shopkeeper] */}
            <div className="flex flex-wrap mx-3 mb-6 gap-7 mt-4">
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
