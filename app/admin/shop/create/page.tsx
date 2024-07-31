'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Newshop {
  shopCode: string;
  name: string;
  description: string;
  street: string;
  city: string;
  state: string;
  phone: string;
}

export default function Page() {
  const [newshop, setNewshop] = useState<Newshop>({
    shopCode: '',
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
    setNewshop({ ...newshop, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/shop', {
        shopCode: newshop.shopCode,
        name: newshop.name,
        description: newshop.description,
        location: {
          street: newshop.street,
          city: newshop.city,
          state: newshop.state,
        },
        phone: newshop.phone,
      });
      setNewshop({
        shopCode: '',
        name: '',
        description: '',
        street: '',
        city: '',
        state: '',
        phone: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to add shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-950 flex flex-col justify-center items-center">
      <div className="w-10/12 md:w-7/12 mb-11">
        <h1 className="text-3xl font-bold mb-3">Create new Shop.</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-950"
        >
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col">
            <label htmlFor="shopCode">Shop Code: </label>
            <input
              type="text"
              name="shopCode"
              placeholder="shop Code"
              value={newshop.shopCode}
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
              value={newshop.name}
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
              value={newshop.description}
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
              value={newshop.street}
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
              value={newshop.city}
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
              value={newshop.state}
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
              value={newshop.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1 text-slate-950"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Shop
          </button>
        </form>
      </div>
    </div>
  );
}
