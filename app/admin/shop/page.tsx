'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function Page() {
  const router = useRouter();

  const [shops, setShops] = useState([]);

  useEffect(() => {
    // fetch shops
    const fetchShop = async () => {
      try {
        const response = await axios.get('/api/shop');
        setShops(response.data.shops);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, []);

  return (
    <div className="md:ml-5 min-h-screen text-slate-950">
      <div>
        <button
          onClick={() => router.push('/admin/shop/create')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          create shop
        </button>
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold">List of available shop</h1>
        <div className="w-10/12">
          <table className="table-responsive w-full">
            <thead className="">
              <tr className="text-left py-2 font-bold bg-slate-200">
                <th className="py-2">No:</th>
                <th>Name</th>
                <th>Code</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop: shopType, index) => (
                <tr
                  onClick={() => router.push(`/admin/shop/details/${shop._id}`)}
                  key={shop._id}
                  className="text-left py-2 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-2">{index + 1}</td>
                  <td>{shop.name}</td>
                  <td>{shop.shopCode}</td>
                  <td>{shop.location.street}</td>
                  <td>{shop.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface shopType {
  _id: string;
  name: string;
  shopCode: string;
  location: {
    street: string;
    city: string;
    state: string;
  };
  phone: string;
}
