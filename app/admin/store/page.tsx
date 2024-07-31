'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function Page() {
  const router = useRouter();

  const [stores, setStores] = useState([]);

  useEffect(() => {
    // fetch stores
    const fetchStores = async () => {
      try {
        const response = await axios.get('/api/store');
        setStores(response.data.stores);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="md:ml-5 min-h-screen text-slate-950">
      <div>
        <button
          onClick={() => router.push('/admin/store/create')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          create store
        </button>
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold">List of available Store</h1>
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
              {stores.map((store: storeType, index) => (
                <tr
                  key={store._id}
                  onClick={() =>
                    router.push(`/admin/store/details/${store._id}`)
                  }
                  className="text-left py-2 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-2">{index + 1}</td>
                  <td>{store.name}</td>
                  <td>{store.storeCode}</td>
                  <td>{store.location.street}</td>
                  <td>{store.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface storeType {
  _id: string;
  name: string;
  storeCode: string;
  location: {
    street: string;
    city: string;
  };
  phone: string;
}
