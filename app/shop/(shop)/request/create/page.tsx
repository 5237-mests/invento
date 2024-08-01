'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
  productCode: string;
  quantity: number;
}

// interface Shop {
//   _id: string;
//   name: string;
// }

interface NewlyAddedItem {
  item: string;
  name: string;
  quantity: number;
}

export default function RequestComponent() {
  const [items, setItems] = useState<Item[]>([]);
  // const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  // const [selectedShop, setSelectedShop] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [newlyAddedItem, setNewlyAddedItem] = useState<NewlyAddedItem[]>([]);

  useEffect(() => {
    fetchItems();
    // fetchShops();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items'); // Adjust the endpoint if different
      setItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // const fetchShops = async () => {
  //   try {
  //     const response = await axios.get('/api/shop'); // Adjust the endpoint if different
  //     setShops(response.data.shops);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching shops:', error);
  //   }
  // };

  const handleCreateRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (newlyAddedItem.length === 0) return;
    try {
      const user = JSON.parse(localStorage.getItem('user')!);
      const shop = user['workAt'];
      const newRequest = { items: newlyAddedItem, shop: shop };
      await axios.post('/api/request', newRequest);
      // Reset form after successful request
      setSelectedItem('');
      // setSelectedShop('');
      setQuantity(1);
      setNewlyAddedItem([]);
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const addItemsToItemList = () => {
    const selectedItemDetails = items.find((item) => item._id === selectedItem);
    if (!selectedItemDetails) return;

    const newItem: NewlyAddedItem = {
      item: selectedItem,
      name: selectedItemDetails.name,
      quantity,
    };

    const existingItem = newlyAddedItem.find(
      (item) => item.item === selectedItem,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      setNewlyAddedItem([...newlyAddedItem]);
    } else {
      setNewlyAddedItem([...newlyAddedItem, newItem]);
    }
    // Reset item and quantity fields after adding
    setSelectedItem('');
    setQuantity(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
          <select
            className="p-3 bg-white border border-gray-300 rounded-md"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
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
          {/* <select
            className="p-3 bg-white border border-gray-300 rounded-md"
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
          </select> */}
          <input
            className="p-3 bg-white border border-gray-300 rounded-md"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
          />
          <div
            onClick={addItemsToItemList}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-center"
          >
            Add Item
          </div>
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${newlyAddedItem.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            type="submit"
          >
            Create Request
          </button>
        </form>

        <div className="">
          <h1 className="text-xl font-bold mb-4">Newly Added Items</h1>
          {newlyAddedItem.length > 0 ? (
            <table className="min-w-full border-collapse block md:table">
              <thead className="block md:table-header-group">
                <tr className="border border-gray-300 md:border-none block md:table-row absolute -top-full -left-full md:top-auto md:left-auto md:relative">
                  <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">
                    Item
                  </th>
                  <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">
                    Quantity
                  </th>
                  <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 block md:table-cell">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {newlyAddedItem.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border border-gray-300 md:border-none block md:table-row"
                  >
                    <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                      {item.name}
                    </td>
                    <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                      {item.quantity}
                    </td>
                    <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
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
            <div>No items added yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
