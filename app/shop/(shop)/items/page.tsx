'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

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
        item?.item?.name.toLowerCase().startsWith(term) ||
        item?.item?.productCode.toLowerCase().startsWith(term),
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
    const shop = '6681ea085f68cc1d3b9ceb55';
    try {
      const response = await axios.get(`/api/shop/items/?shopId=${shop}`);
      setItems(response.data.items);
      setFilteredItems(response.data.items); // initialize filteredItems
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching items:', error);
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
      <div className="min-h-screen flex items-center justify-center text-slate-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="md:p-3 min-h-screen text-slate-950">
      <div className="md:m-3">
        <div className="m-2 ">
          <p>Total items: {filteredItems.length}</p>
          <div className="">
            <p className="p-1">Search item by name or product code</p>
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded p-1 text-slate-950"
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
                  <th className="px-2">Shop Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-200"
                    onClick={() => router.push(`/shop/items/${item.item._id}`)}
                  >
                    <td className="py-1 px-2">
                      {searched ? index + 1 : items.indexOf(item) + 1}
                    </td>
                    <td className="py-1 px-2">{item?.item?.name}</td>
                    <td className="px-2">{item?.item?.productCode}</td>
                    <td className="px-2">{item?.item?.measurementUnit}</td>
                    <td className="px-2">{item?.item?.price}</td>
                    <td className="px-2">{item?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
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

interface Item {
  _id: string;
  item: {
    _id: string;
    productCode: string;
    name: string;
    price: number;
    description: string;
    category: string;
    measurementUnit: string;
  };
  quantity: number;
}
