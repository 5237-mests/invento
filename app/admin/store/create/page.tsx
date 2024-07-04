'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface NewStore {
  storeCode: string;
  name: string;
  description: string;
  street: string;
  city: string;
  state: string;
  phone: string;
}

export default function Page() {
  const [newStore, setNewStore] = useState<NewStore>({
    storeCode: '',
    name: '',
    description: '',
    street: '',
    city: '',
    state: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/store', {
        storeCode: newStore.storeCode,
        name: newStore.name,
        description: newStore.description,
        location: {
          street: newStore.street,
          city: newStore.city,
          state: newStore.state,
        },
        phone: newStore.phone,
      });
      setNewStore({
        storeCode: '',
        name: '',
        description: '',
        street: '',
        city: '',
        state: '',
        phone: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to add store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-950 flex flex-col justify-center items-center">
      <div className="w-10/12 md:w-7/12 mb-11">
        <h1 className="text-3xl font-bold mb-3">Create new Store.</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-950"
        >
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col">
            <label htmlFor="storeCode">Store Code: </label>
            <input
              type="text"
              name="storeCode"
              placeholder="Store Code"
              value={newStore.storeCode}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newStore.name}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={newStore.description}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Street</label>
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={newStore.street}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newStore.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">State</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={newStore.state}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newStore.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
}
