'use client'; // Assuming this is a typo, it should be 'use strict' or not used in this context
import Links from '@/components/Links';
import axios from 'axios';
import SideBar from '@/components/admin/sideBar';
import logout from '@/lib/logout';
import Link from 'next/link';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Fetch stores and shops
    const fetchStores = async () => {
      try {
        const response = await axios.get('/api/store');
        console.log('Stores:', response.status);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    const fetchShops = async () => {
      try {
        const response = await axios.get('/api/shop');
        console.log('Shops:', response.status);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    // Initiate data fetching
    fetchStores();
    fetchShops();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row bg-slate-100 min-h-screen">
        {/* Sidebar (hidden on mobile) */}
        <div className="hidden md:flex md:w-64 bg-slate-800 sidebar text-white">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h1 className="text-2xl font-bold">
                <Link href="/admin">Admin</Link>
              </h1>
            </div>
            <div className="p-4">
              <ul>
                <Link href="/admin/user">
                  <li className={`p-2 hover:underline`}>User</li>
                </Link>

                <Link href="/admin/items">
                  <li className={`p-2 hover:underline`}>Items</li>
                </Link>

                <Link href="/admin/store">
                  <li className={`p-2 hover:underline`}>Store</li>
                </Link>

                <Link href="/admin/shop">
                  <li className={`p-2 hover:underline`}>Shop</li>
                </Link>

                <Link href="/admin/request">
                  <li className={`p-2 hover:underline`}>Request</li>
                </Link>
              </ul>
            </div>
            <div className="mt-auto p-4">
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:flex-1 md:ml-64 bg-white ">
          <div className="p-6 md:mt-10 md:text-slate-800 flex justify-between main-side">
            <div>
              <Links />
            </div>

            <div className="md:hidden">
              <SideBar />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
