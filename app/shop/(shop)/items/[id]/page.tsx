'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [item, setItem] = useState([{} as Item]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      const shopId = '6681ea085f68cc1d3b9ceb55';
      try {
        const response = await axios.get(
          `/api/shop/items/?itemId=${params.id}&shopId=${shopId}`,
        );

        setItem(response.data.item);
        setLoading(false);
      } catch (error) {
        toast({
          description: 'Error fetching item.',
          variant: 'destructive',
        });
        router.push('/shop/items'); // Redirect to items page if the item cannot be fetched
      }
    };
    fetchItem();
  }, [params.id, router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="mb-7 min-h-screen text-slate-950 flex flex-col justify-center items-center p-4 md:p-0">
      <h1 className="text-lg  md:text-2xl font-bold mb-4">Item details.</h1>
      <div className="w-full max-w-lg">
        <form className="flex flex-col gap-4 text-slate-900">
          <div className="flex flex-col gap-1">
            {item?.map((item) => (
              <div key={item.item.productCode} className="flex flex-col gap-1">
                <label>Product Code: </label>
                <input
                  disabled
                  value={item.item.productCode}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Name:</label>
                <input
                  disabled
                  value={item.item.name}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Price: </label>
                <input
                  disabled
                  value={item.item.price}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Description: </label>
                <input
                  disabled
                  value={item.item.description}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Category: </label>
                <input
                  disabled
                  value={item.item.category}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Measurement Unit: </label>
                <input
                  disabled
                  value={item.item.measurementUnit}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <label>Quantity: </label>
                <input
                  disabled
                  value={item.quantity}
                  className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

interface Item {
  item: {
    productCode: string;
    name: string;
    price: string;
    description: string;
    category: string;
    measurementUnit: string;
  };
  quantity: number;
}
