// import Links from '@/components/Links';
// import SideBar from '@/components/shop/sideBar';
// import axios from 'axios';
// import Link from 'next/link';
// import { useEffect } from 'react';

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     // fetch stores and shops
//     const fetchStores = async () => {
//       try {
//         await axios.get('/api/store');
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const fetchShops = async () => {
//       try {
//         await axios.get('/api/shop');
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchStores();
//     fetchShops();
//   }, []);
//   return (
//     <>
//       <div className="flex flex-col md:flex-row bg-slate-100 min-h-screen">
//         {/* Sidebar (hidden on mobile) */}
//         <div className="hidden md:flex md:w-64 bg-slate-800 sidebar text-white">
//           <div className="flex flex-col h-full">
//             <div className="p-4">
//               <h1 className="text-2xl font-bold">
//                 <Link href="/shop">Shop</Link>
//               </h1>
//             </div>
//             <div className="p-4">
//               <ul>
//                 <Link href="/admin/items">
//                   <li className={`p-2 hover:underline`}>Items</li>
//                 </Link>

//                 <Link href="/admin/request">
//                   <li className={`p-2 hover:underline`}>Request</li>
//                 </Link>
//               </ul>
//             </div>
//             <div className="mt-auto p-4">
//               <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="w-full md:flex-1 md:ml-64 bg-white ">
//           <div className="p-6 md:mt-10 md:text-slate-800 flex justify-between main-side">
//             <div>
//               <Links />
//             </div>

//             <div className="md:hidden">
//               <SideBar />
//             </div>
//           </div>
//           {children}
//         </div>
//       </div>
//     </>
//   );
// }

'use client';
import Links from '@/components/Links';
import SideBar from '@/components/shop/sideBar';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const fetchStores = async () => {
      try {
        await axios.get('/api/store');
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    const fetchShops = async () => {
      try {
        await axios.get('/api/shop');
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchStores();
    fetchShops();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-slate-100 min-h-screen">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden md:flex md:w-64 bg-slate-800 sidebar text-white">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold">
              <Link href="/shop">Shop</Link>
            </h1>
          </div>
          <div className="p-4">
            <ul>
              <Link href="/shop/items">
                <li className="p-2 hover:underline">Items</li>
              </Link>

              <Link href="/shop/request">
                <li className="p-2 hover:underline">Request</li>
              </Link>
            </ul>
          </div>
          <div className="mt-auto p-4">
            <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:flex-1 md:ml-64 bg-white">
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
  );
};

export default RootLayout;
