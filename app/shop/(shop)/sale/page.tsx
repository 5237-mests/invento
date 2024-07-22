'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SaleListItem from '@/components/shop/SaleListItem';
import Spinner from '@/components/Spinner';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSales = async () => {
    try {
      const response = await axios.get('/api/sales');
      setSales(response.data.sales);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch sales data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-950">
        <Spinner />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Overview</h1>
      {sales.length === 0 ? (
        <p className="text-center">No sales found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {sales?.map((sale: any) => (
            <SaleListItem key={sale._id} sale={sale} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SalesPage;
