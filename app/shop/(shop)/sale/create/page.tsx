'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SaleForm from '@/components/shop/SaleForm';
import { toast } from '@/components/ui/use-toast';

const Page = () => {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [itemsResponse, customersResponse, shopsResponse] =
          await Promise.all([
            axios.get('/api/items'),
            axios.get('/api/customers'),
            axios.get('/api/shop'),
          ]);
        setItems(itemsResponse.data.items);
        setCustomers(customersResponse.data.customers);
        setShops(shopsResponse.data.shops);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch initial data');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateSale = async (formData: any) => {
    try {
      const response = await axios.post('/api/sales', formData);
      if (response.status === 201) {
        // Handle success
        toast({
          title: 'Sales',
          description: 'Sales created successfully',
        });
        window.location.reload();
      } else {
        // Handle error
        toast({
          title: 'Error creating sale',
          description: 'Error creating sale',
          variant: 'destructive',
        });
      }
      // Redirect or show success message
    } catch (error) {
      console.error('Error creating sale:', error);
      // Handle error
    }
  };

  if (loading)
    if (error)
      if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Sale</h1>
      <SaleForm
        items={items}
        customers={customers}
        shops={shops}
        onCreateSale={handleCreateSale}
      />
    </div>
  );
};

export default Page;
