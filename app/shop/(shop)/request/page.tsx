"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Item {
  _id: string;
  name: string;
  productCode: string;
  quantity: number;
}

interface Shop {
  _id: string;
  name: string;
}

interface Items {
  item: string;
  quantity: number;
}

export default function RequestComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [newlyAddedItem, setNewlyAddedItem] = useState<Items[]>([]);

  useEffect(() => {
    fetchItems();
    fetchShops();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items"); // Adjust the endpoint if different
      setItems(response.data.items);
      console.log(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get("/api/shop"); // Adjust the endpoint if different
      setShops(response.data.shops);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleCreateRequest = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newRequest = { items: [...newlyAddedItem], shop: selectedShop };
      await axios.post("/api/request", newRequest);
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const addItemsToItemList = () => {
    const newItem = { item: selectedItem, quantity };
    // check if item already exists in the list
    const existingItem = newlyAddedItem.find(
      (item) => item.item === selectedItem,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      setNewlyAddedItem([...newlyAddedItem]);
    } else {
      setNewlyAddedItem([...newlyAddedItem, newItem]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container m-7">
      <h1 className="text-2xl font-bold mb-4">Request Items</h1>

      <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
        <select
          className="w-1/2 p-3"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          className="w-1/2 p-3"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Shop
          </option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
        <input
          className="w-1/2 p-3 bg-[#f5f5f5] border border-gray-300 rounded-md"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          min={1}
        />
        <div
          onClick={addItemsToItemList}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
        >
          Add Item
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
          type="submit"
        >
          Create Request
        </button>
      </form>

      <div>
        <h1 className="text-2xl font-bold mb-4">Newly Added Items</h1>
        {newlyAddedItem.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {newlyAddedItem.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      onClick={() =>
                        setNewlyAddedItem(
                          newlyAddedItem.filter((_, i) => i !== index),
                        )
                      }
                      className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>'No items added yet'</div>
        )}
      </div>
    </div>
  );
}
