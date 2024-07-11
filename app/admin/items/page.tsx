'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Item {
  _id: string;
  productCode: string;
  name: string;
  price: number;
  description: string;
  category: string;
  shopQuantity: number;
  storeQuantity: number;
  measurementUnit: string;
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, items]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().startsWith(term) ||
        item.productCode.toLowerCase().startsWith(term),
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to the first page on search
    setSearched(true);
    if (filtered.length === 0) setSearched(false);
    if (
      filtered.length === items.length ||
      filtered.length === 0 ||
      filtered.length >= itemsPerPage
    )
      setSearched(false);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data.items);
      setFilteredItems(response.data.items); // initialize filteredItems
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearched(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the paginated items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen text-3xl flex items-center justify-center text-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 min-h-screen text-slate-950">
      <div className="md:m-3">
        <div className="flex flex-col md:flex-row justify-between m-1 p-1">
          <Link
            href="/admin/items/additems/new"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 md:mb-0"
          >
            Create new item
          </Link>
        </div>

        <div className="m-2">
          <p>Total items: {filteredItems.length}</p>
          <div className="">
            <p className="p-1">Search item by name or product code.</p>
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded p-1 text-slate-950 w-full md:w-1/2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center mt-4">
            No items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="">
                <tr className="text-left py-2 font-bold bg-slate-300">
                  <th className="py-2 px-2">No:</th>
                  <th className="px-2">Name</th>
                  <th className="px-2">Code</th>
                  <th className="px-2">Unit</th>
                  <th className="px-2">Price</th>
                  <th className="px-2">Store Stock</th>
                  <th className="px-2">Shop Stock</th>
                  <th className="px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-200 cursor-pointer"
                    onClick={() => router.push(`/admin/items/edit/${item._id}`)}
                  >
                    <td className="py-1 px-2">
                      {searched ? index + 1 : items.indexOf(item) + 1}
                    </td>
                    <td className="py-1 px-2">{item.name}</td>
                    <td className="px-2">{item.productCode}</td>
                    <td className="px-2">{item.measurementUnit}</td>
                    <td className="px-2">{item.price}</td>
                    <td className="px-2">{item.shopQuantity}</td>
                    <td className="px-2">{item.storeQuantity}</td>
                    <td className="px-2">
                      {item.storeQuantity + item.shopQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 my-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
