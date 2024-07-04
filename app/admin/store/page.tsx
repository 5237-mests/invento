"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  const [stores, setStores] = useState([]);

  useEffect(() => {
    // fetch stores
    const fetchStores = async () => {
      try {
        const response = await axios.get("/api/store");
        setStores(response.data.stores);
        console.log(response.data.stores);
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
          onClick={() => router.push("/admin/store/create")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          create store
        </button>
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold">List of available Store</h1>
        <div>
          {stores.map((store: any, index) => (
            <div key={store._id} className="mt-5">
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
                  <tr
                    onClick={() =>
                      router.push(`/admin/store/details/${store._id}`)
                    }
                    key={store.id}
                    className="text-left py-2 font-bold"
                  >
                    <td className="py-2">{index + 1}</td>
                    <td>{store.name}</td>
                    <td>{store.storeCode}</td>
                    <td>{store.location.street}</td>
                    <td>{store.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
