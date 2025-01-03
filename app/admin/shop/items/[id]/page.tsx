'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import Spinner from '@/components/Spinner';

export default function Page({ params }: { params: { id: string } }) {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    fetchShop();
  }, [router]);

  useEffect(() => {
    const debounceSearch = debounce(() => {
      handleSearch();
    }, 300);

    debounceSearch();
    return () => debounceSearch.cancel();
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
  };

  const fetchShop = async () => {
    try {
      const response = await axios.get(`/api/shop/items/?shopId=${params.id}`);
      setItems(response.data.items);
      setFilteredItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        <div className="flex flex-row justify-between m-1 p-1">
          <p className="font-bold text-2xl">Items list</p>
          <Link
            href="/admin/shop/items/additems"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add item to this shop
          </Link>
        </div>

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
                  <th className="px-2">Shop Stock*</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item._id} className="hover:bg-slate-200">
                    <td className="py-1 px-2">
                      {indexOfFirstItem + index + 1}
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
    productCode: string;
    name: string;
    price: number;
    description: string;
    category: string;
    measurementUnit: string;
  };
  quantity: number;
}
