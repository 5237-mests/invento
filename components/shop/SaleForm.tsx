'use client';
import { useState } from 'react';
import Select from 'react-select';

const SaleForm = ({
  items,
  customers,
  shops,
  onCreateSale,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customers: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shops: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreateSale: (formData: any) => void;
}) => {
  const [selectedItems, setSelectedItems] = useState<
    { itemId: string; quantity: number }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedShop, setSelectedShop] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleItemChange = (selectedOption: any) => {
    if (!selectedOption) return;
    const itemId = selectedOption.value;
    // const itemName = selectedOption.label;
    const itemIndex = selectedItems.findIndex((item) => item.itemId === itemId);
    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex].quantity += 1; // Increase quantity if already selected
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = selectedItems.filter((item) => item.itemId !== itemId);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      items: selectedItems,
      customer: selectedCustomer,
      shop: selectedShop,
    };
    onCreateSale(formData);
  };

  // Prepare options for react-select dropdown
  const itemOptions = items.map((item) => ({
    value: item._id,
    label: item.name, // Adjust based on how item names are stored
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded p-4 mb-4"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select customer...</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {`${customer.firstName} ${customer.lastName}`}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Shop</label>
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        >
          <option value="" disabled>
            Select shop...
          </option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Items</label>
        <Select
          options={itemOptions}
          onChange={handleItemChange}
          className="mt-1 w-full"
          placeholder="Search and select item..."
          isClearable
          isSearchable
          maxMenuHeight={200}
        />
      </div>
      <div>
        {selectedItems.map((selectedItem) => (
          <div
            key={selectedItem.itemId}
            className="flex items-center space-x-4 mb-2"
          >
            <p className="text-sm">
              {items.find((item) => item._id === selectedItem.itemId)?.name}
            </p>
            <input
              type="number"
              min="1"
              className="border border-gray-300 rounded-md p-2 w-20 text-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              value={selectedItem.quantity}
              onChange={() => {
                // const quantity = parseInt(e.target.value);
                handleItemChange({ value: selectedItem.itemId, label: '' }); // Update quantity directly
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(selectedItem.itemId)}
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Create Sale
      </button>
    </form>
  );
};

export default SaleForm;
