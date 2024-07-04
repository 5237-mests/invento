"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    productCode: "",
    name: "",
    storeStock: 0,
  });
  const [isProductCodeValid, setIsProductCodeValid] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "productCode") {
      handleProductCodeChange(value);
    }
  };

  const handleProductCodeChange = async (productCode: string) => {
    if (productCode) {
      try {
        const response = await axios.get(
          `/api/items?productCode=${productCode}`,
        );
        // parse the response data
        const res = JSON.parse(JSON.stringify(response.data));

        if (res.data && res.data.name) {
          setForm((prevForm) => ({
            ...prevForm,
            name: res.data.name,
          }));
          setIsProductCodeValid(true);
        } else {
          setForm((prevForm) => ({
            ...prevForm,
            name: "",
          }));
          setIsProductCodeValid(false);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        setForm((prevForm) => ({
          ...prevForm,
          name: "",
        }));
        setIsProductCodeValid(false);
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        name: "",
      }));
      setIsProductCodeValid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProductCodeValid) {
      toast({
        description: "Invalid product code.",
      });
      return;
    }

    try {
      await axios.patch(`/api/items/?productCode=${form.productCode}`, {
        productCode: form.productCode,
        name: form.name,
        stockQuantity: {
          store: form.storeStock,
        },
      });
      toast({
        description: "Item added to store successfully!",
      });
      setForm({
        productCode: "",
        name: "",
        storeStock: 0,
      });
    } catch (error) {
      console.error("Error adding an item:", error);
      toast({
        description: "Failed to add item to the store.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-950">
      <h1 className="text-lg md:text-3xl font-bold">Add items to store.</h1>
      <p className="text-slate-500 p-1">
        Please fill in the form below to add an item to the store.
      </p>
      <p>
        <strong>Note:</strong> This page is for updating the quantity of an item
        in the store.
      </p>

      <div className="m-5  w-11/12 md:w-9/12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-900 m-7"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="productCode" className="">
              Product Code:
            </label>
            <input
              name="productCode"
              placeholder="Product Code"
              value={form.productCode}
              onChange={handleChange}
              required
              className={`border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 ${!isProductCodeValid ? "border-red-500" : "focus:ring-red-500"}`}
              type="text"
            />
            {!isProductCodeValid && (
              <p className="text-red-500">Product code does not exist.</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="">
              Name:
            </label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="text"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="storeStock" className="">
              Store Stock:
            </label>
            <input
              name="storeStock"
              placeholder="Store Stock"
              value={form.storeStock}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="number"
              min="1"
            />
          </div>
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
  storeStock: number;
}

// 'use client'
// import { useState, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';
// import { useToast } from '@/components/ui/use-toast';

// export default function Page() {
//   const { toast } = useToast();
//   const [form, setForm] = useState<FormState>({
//     productCode: '',
//     name: '',
//     storeStock: 0,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.patch('/api/items', {
//         productCode: form.productCode,
//         name: form.name,
//         stockQuantity: {
//           store: form.storeStock,
//         },
//       });
//       toast({
//         description: "Item added to store successfully!",
//       });
//       setForm({
//         productCode: '',
//         name: '',
//         storeStock: 0,
//       });
//     } catch (error) {
//       toast({
//         description: "Failed to add item to store.",
//       })
//     }
//   };

//   return (
//     <div className="p-5 h-auto text-slate-950">
//       <div className="ml-7">
//         <h1 className="text-3xl font-bold">Add items to store.</h1>
//         <p className="text-slate-500">Please fill in the form below to add an item to the store.</p>
//         <p><strong>Note:</strong>This page is for updating quantity of an item in the store.</p>
//       </div>

//       <div className="m-7 w-5/12">
//         <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-slate-900 m-7'>
//           {['productCode', 'name', 'storeStock'].map((field, index) => (
//             <div className='flex flex-col gap-1' key={index}>
//               <label htmlFor={field} className="">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
//               <input
//                 name={field}
//                 placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                 value={form[field as keyof FormState]}
//                 onChange={handleChange}
//                 required={['productCode', 'storeStock'].includes(field)}
//                 className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 type={['storeStock'].includes(field) ? 'number' : 'text'}
//               />
//             </div>
//           ))}
//           <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Item</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// interface FormState {
//   productCode: string;
//   name: string;
//   storeStock: number;
// }
