// cretae store edit page
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  const [updatedStore, setUpdatedStore] = useState({} as Store);
  const [fieldUpdated, setFieldUpdated] = useState(false);

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

  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldUpdated(true);
    const { name, value } = e.target;
    if (name === 'street' || name === 'city' || name === 'state') {
      setUpdatedStore({
        ...updatedStore,
        location: { ...updatedStore.location, [name]: value },
      });
    } else {
      setUpdatedStore({ ...updatedStore, [name]: value });
    }
  };
  // delete store
  const deleteStore = async () => {
    try {
      await axios.delete(`/api/store/?id=${store._id}`);
      router.push('/admin/store');
    } catch (error) {
      console.log(error);
    }
  };

  // update store
  const updateStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // update only updated fields
    // update store
    try {
      await axios.patch(`/api/store/?id=${store._id}`, updatedStore);
      router.push(`/admin/store/details/${store._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:mx-5 min-h-screen text-slate-950 mx-3">
      <h1 className="text-2xl font-bold mb-5">Edit store</h1>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push('/admin/store')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={deleteStore}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>

      <div className="">
        {/* form */}
        <form action="" onSubmit={updateStore}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="storeCode"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Store Code:
              </label>
              <input
                type="text"
                id="storeCode"
                name="storeCode"
                value={fieldUpdated ? updatedStore.storeCode : store.storeCode}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={fieldUpdated ? updatedStore.name : store.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={
                  fieldUpdated ? updatedStore.description : store.description
                }
                onChange={(e) => {
                  setFieldUpdated(true);
                  setUpdatedStore({
                    ...updatedStore,
                    description: e.target.value,
                  });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={fieldUpdated ? updatedStore.phone : store.phone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Location
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={
                  fieldUpdated
                    ? updatedStore.location?.street
                    : store.location?.street
                }
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <input
                type="text"
                id="city"
                name="city"
                value={
                  fieldUpdated
                    ? updatedStore.location?.city
                    : store.location?.city
                }
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-3"
              />
              <input
                type="text"
                id="state"
                name="state"
                value={
                  fieldUpdated
                    ? updatedStore.location?.state
                    : store.location?.state
                }
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </div>
          <div className=" gap-3 my-5">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
