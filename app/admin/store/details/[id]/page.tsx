'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Store {
  _id: string;
  storeCode: string;
  name: string;
  description: string;
  location: {
    street: string;
    city: string;
    state: string;
  };
  phone: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [store, setStore] = useState({} as Store);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`/api/store/?id=${params.id}`);
        setStore(response.data.store);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);

  // delete store
  const deleteStore = async () => {
    try {
      await axios.delete(`/api/store/?id=${store._id}`);
      router.push('/admin/store');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:ml-5 min-h-screen text-slate-950">
      <h1 className="text-2xl font-bold mb-5">Details of store</h1>
      <div className="flex justify-end gap-3">
        <Link
          href={`/admin/store/items/${store._id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          show items
        </Link>
        <button
          onClick={() => router.push(`/admin/store/edit/${store._id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button
          onClick={deleteStore}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>

      <div className="mb-11">
        {store && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="">Store Code</label>
              <input
                type="text"
                value={store.storeCode}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                value={store.name}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Description</label>
              <textarea
                value={store.description}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Location</label>
              <input
                type="text"
                value={
                  store.location?.street +
                  ', ' +
                  store.location?.city +
                  ', ' +
                  store.location?.state
                }
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Phone</label>
              <input
                type="text"
                value={store.phone}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
