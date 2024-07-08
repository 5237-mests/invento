'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [initialForm, setInitialForm] = useState({
    productCode: '',
    name: '',
    price: '',
    description: '',
    category: '',
    measurementUnit: '',
    shopQuantity: 0,
    storeQuantity: 0,
  });
  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/items/?id=${params.id}`);
        const itemData = {
          productCode: response.data.item.productCode,
          name: response.data.item.name,
          price: response.data.item.price,
          description: response.data.item.description,
          category: response.data.item.category,
          measurementUnit: response.data.item.measurementUnit,
          shopQuantity: response.data.item?.shopQuantity || 0,
          storeQuantity: response.data.item?.storeQuantity || 0,
        };
        setInitialForm(itemData);
        setForm(itemData);
        setLoading(false);
      } catch (error) {
        toast({
          description: 'Error fetching item.',
          variant: 'destructive',
        });
        router.push('/store/items'); // Redirect to items page if the item cannot be fetched
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
          {[
            'productCode',
            'name',
            'price',
            'description',
            'category',
            'measurementUnit',
          ].map((field, index) => (
            <div className="flex flex-col gap-1" key={index}>
              <label htmlFor={field} className="">
                {field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </label>
              <input
                disabled
                name={field}
                placeholder={field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                value={String(form[field as keyof FormState])}
                className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                type={field === 'price' ? 'number' : 'text'}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="">Store Stock:</label>
            <input
              disabled
              placeholder="Store Stock"
              value={initialForm.storeQuantity}
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="number"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

interface FormState {
  productCode: string;
  name: string;
  price: string;
  description: string;
  category: string;
  measurementUnit: string;
}
