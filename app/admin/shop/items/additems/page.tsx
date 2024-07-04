"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";

export default function Page() {
  const { toast } = useToast();
  const [shops, setShops] = useState<shop[]>([]);
  const [form, setForm] = useState<FormState>({
    productCode: "",
    name: "",
    quantity: 0,
    shop: "",
    item: "",
  });
  const [isProductCodeValid, setIsProductCodeValid] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch shops
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/shop");
        setShops(response.data.shops);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch shops",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [toast]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "productCode") {
      debouncedHandleProductCodeChange(value);
    }
  };

  const handleProductCodeChange = async (productCode: string) => {
    if (productCode) {
      try {
        const response = await axios.get(
          `/api/items?productCode=${productCode}`,
        );
        const res = JSON.parse(JSON.stringify(response.data));

        if (res.data && res.data.name) {
          setForm((prevForm) => ({
            ...prevForm,
            name: res.data.name,
            item: res.data._id,
          }));
          setIsProductCodeValid(true);
        } else {
          setForm((prevForm) => ({ ...prevForm, name: "" }));
          setIsProductCodeValid(false);
        }
      } catch (error) {
        setForm((prevForm) => ({ ...prevForm, name: "" }));
        setIsProductCodeValid(false);
      }
    } else {
      setForm((prevForm) => ({ ...prevForm, name: "" }));
      setIsProductCodeValid(false);
    }
  };

  const debouncedHandleProductCodeChange = debounce(
    handleProductCodeChange,
    300,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isProductCodeValid) {
      try {
        await axios.post("/api/shop/addItems", {
          itemId: form.item,
          shopId: form.shop,
          quantity: Number(form.quantity),
        });
        toast({
          title: "Success",
          description: "Item added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add item",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-950">
      <h1 className="text-lg md:text-3xl font-bold">Add items to shop.</h1>
      <p className="text-slate-500 p-1">
        Please fill in the form below to add an item to the shop.
      </p>

      <div className="w-11/12 md:w-9/12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-900 m-7"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="productCode">Product Code:</label>
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
            <label htmlFor="name">Item:</label>
            <input
              name="name"
              placeholder="Item Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="text"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity">Quantity:</label>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="number"
              min="1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="shop">shop:</label>
            <select
              name="shop"
              className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select shop
              </option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                shops.map((shop: shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 my-10 text-white font-bold py-2 px-4 rounded"
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
  quantity: number;
  item: string;
  shop: string;
}

interface shop {
  _id: string;
  name: string;
}
