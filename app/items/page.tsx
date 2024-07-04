"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<FormState>({
    productCode: "",
    name: "",
    price: "",
    description: "",
    category: "",
    storeStock: 0,
    measurementUnit: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, items]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().startsWith(term) ||
        item.productCode.toLowerCase().startsWith(term),
    );
    setFilteredItems(filtered);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items");
      setItems(response.data.items);
      setFilteredItems(response.data.items); // initialize filteredItems
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/items", {
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
      fetchItems();
      // setForm({
      //   productCode: '',
      //   name: '',
      //   price: '',
      //   description: '',
      //   category: '',
      //   storeStock: 0,
      //   measurementUnit: ''
      // });
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-5 h-auto text-slate-950">
      <h1 className="text-xl font-bold text-white">Add new items to store.</h1>
      <div className="m-7 w-5/12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-slate-900 m-7"
        >
          {[
            "productCode",
            "name",
            "price",
            "description",
            "category",
            "storeStock",
            "measurementUnit",
          ].map((field, index) => (
            <div className="flex flex-col gap-1" key={index}>
              <label htmlFor={field} className="text-white">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </label>
              <input
                name={field}
                placeholder={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={form[field as keyof FormState]}
                onChange={handleChange}
                required={["productCode", "name", "price"].includes(field)}
                className="border border-gray-300 rounded p-2 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                type={
                  ["price", "storeStock"].includes(field) ? "number" : "text"
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

      <div className="m-7 text-white">
        <div className="flex justify-between m-1 p-1">
          <p>Total items: {filteredItems.length}</p>
          <div className="flex gap-2">
            <p className="p-1">Search item by name or product code</p>
            <input
              type="text"
              placeholder="Search item by name or product code..."
              className="border border-gray-300 rounded p-1 text-slate-950"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="table-responsive w-full">
          <thead className="">
            <tr className="text-left py-2 font-bold bg-slate-700">
              <th className="py-1">Name</th>
              <th>Code</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Store Stock</th>
              <th>Shop Stock</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id} className="hover:bg-slate-700">
                <td>{item.name}</td>
                <td>{item.productCode}</td>
                <td>{item.measurementUnit}</td>
                <td>{item.price}</td>
                <td>{item.stockQuantity.store}</td>
                <td>{item.stockQuantity.shop}</td>
                <td>{item.stockQuantity.store + item.stockQuantity.shop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface Item {
  _id: string;
  productCode: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stockQuantity: {
    store: number;
    shop: number;
  };
  measurementUnit: string;
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
