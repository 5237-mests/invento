'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export default function Page() {
  const [form, setForm] = useState<FormState>({
    productCode: '',
    name: '',
    price: '',
    description: '',
    category: '',
    storeStock: 0,
    measurementUnit: '',
  });

  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/items', {
        productCode: form.productCode,
        name: form.name,
        price: form.price,
        description: form.description,
        category: form.category,
        stockQuantity: {
          store: form.storeStock,
        },
        measurementUnit: form.measurementUnit,
      });
      toast({
        description: 'Item created successfully!',
      });
      setForm({
        productCode: '',
        name: '',
        price: '',
        description: '',
        category: '',
        storeStock: 0,
        measurementUnit: '',
      });
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        description: 'Error creating item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-950 mb-5">
      <h1 className="md:text-3xl text-2xl font-bold">
        Add new items to store.
      </h1>
      <div className="w-11/12 md:w-9/12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-900 m-7"
        >
          {[
            'productCode',
            'name',
            'price',
            'description',
            'category',
            'storeStock',
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
                name={field}
                placeholder={field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                value={form[field as keyof FormState]}
                onChange={handleChange}
                required={['productCode', 'name', 'price'].includes(field)}
                className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                type={
                  ['price', 'storeStock'].includes(field) ? 'number' : 'text'
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
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
  storeStock: number;
  measurementUnit: string;
}
