'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface FormState {
  itemId: string;
  storeId: string;
  quantity: number;
  name: string;
  productCode: string;
}

export default function Page() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    itemId: '',
    storeId: '66819e7c954d3862e992cb9e',
    quantity: 0,
    name: '',
    productCode: '',
  });
  const [isProductCodeValid, setIsProductCodeValid] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'productCode') {
      handleProductCodeChange(value);
    }
  };

  const handleProductCodeChange = async (productCode: string) => {
    if (productCode) {
      try {
        const response = await axios.get(
          `/api/items?productCode=${productCode}`,
        );
        const res = response.data;

        if (res.item && res.item.name) {
          setForm((prevForm) => ({
            ...prevForm,
            name: res.item.name,
            itemId: res.item._id,
          }));
          setIsProductCodeValid(true);
        } else {
          setForm((prevForm) => ({
            ...prevForm,
            name: '',
          }));
          setIsProductCodeValid(false);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setForm((prevForm) => ({
          ...prevForm,
          name: '',
        }));
        setIsProductCodeValid(false);
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        name: '',
      }));
      setIsProductCodeValid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProductCodeValid) {
      toast({
        description: 'Invalid product code.',
      });
      return;
    }

    try {
      // await axios.patch(`/api/items/?productCode=${form.productCode}`, {
      //   productCode: form.productCode,
      //   name: form.name,
      //   stockQuantity: {
      //     store: form.storeStock,
      //   },
      // });
      // toast({
      //   description: 'Item added to store successfully!',
      // });
      // setForm({
      //   productCode: '',
      //   name: '',
      //   storeStock: 0,
      // });
      const body = {
        itemId: form.itemId,
        storeId: form.storeId,
        quantity: Number(form.quantity),
      };

      await axios.post('/api/store/items', body);
      toast({
        description: 'Item added to store successfully!',
      });
      setForm({
        itemId: '',
        storeId: '66819e7c954d3862e992cb9e',
        quantity: 0,
        name: '',
        productCode: '',
      });
    } catch (error) {
      console.error('Error adding an item:', error);
      toast({
        description: 'Failed to add item to the store.',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-950 p-4">
      <h1 className="text-lg md:text-3xl font-bold">Add items to store.</h1>
      <p className="text-slate-500 p-1 text-center">
        Please fill in the form below to add an item to the store.
      </p>
      <p className="text-center">
        <strong>Note:</strong> This page is for updating the quantity of an item
        in the store.
      </p>

      <div className="m-5 w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-900"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="productCode" className="font-medium">
              Product Code:*
            </label>
            <input
              name="productCode"
              placeholder="Product Code"
              value={form.productCode}
              onChange={handleChange}
              required
              className={`border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 ${
                !isProductCodeValid ? 'border-red-500' : 'focus:ring-red-500'
              }`}
              type="text"
            />
            {!isProductCodeValid && (
              <p className="text-red-500 text-sm">
                Product code does not exist.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium">
              Name:
            </label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="text"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="font-medium">
              Quantity:*
            </label>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="number"
              min="1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
