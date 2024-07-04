"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface shop {
  _id: string;
  shopCode: string;
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
  const [shop, setShop] = useState({} as shop);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(`/api/shop/?id=${params.id}`);
        setShop(response.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, []);

  // delete shop
  const deleteshop = async () => {
    try {
      await axios.delete(`/api/shop/?id=${shop._id}`);
      router.push("/admin/shop");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:ml-5 min-h-screen text-slate-950">
      <h1 className="text-2xl font-bold mb-5">Details of shop</h1>
      <div className="flex justify-end gap-3">
        <Link
          href={`/admin/shop/items/${shop._id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          show items
        </Link>
        <button
          onClick={() => router.push(`/admin/shop/edit/${shop._id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button
          onClick={deleteshop}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>

      <div className="mb-11">
        {shop && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="">shop Code</label>
              <input
                type="text"
                value={shop.shopCode}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                value={shop.name}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Description</label>
              <textarea
                value={shop.description}
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Location</label>
              <input
                type="text"
                value={
                  shop.location?.street +
                  ", " +
                  shop.location?.city +
                  ", " +
                  shop.location?.state
                }
                disabled
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Phone</label>
              <input
                type="text"
                value={shop.phone}
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
