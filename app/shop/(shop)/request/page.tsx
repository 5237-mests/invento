'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

const Page = () => {
  const [requests, setRequests] = useState<request[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/request');
      setRequests(response.data.reqs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await axios.put(`/api/admin/requests/${id}/reject`); // Adjust endpoint for rejection
      fetchRequests(); // Refresh requests after update
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-3">
      <div className="w-full md:w-11/12 mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Requests</h1>
        <div className="bg-slate-200 p-2">
          <Link
            className="underline hover:text-blue-600 text-red-600"
            href="/shop/request/create"
          >
            Create Request
          </Link>
        </div>
      </div>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="w-full md:w-11/12 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left font-bold bg-slate-300">
                <th className="p-2">No:</th>
                <th className="p-2">Items</th>
                <th className="p-2">Status</th>
                <th className="p-2">Approved</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request._id}
                  className="border-b border-slate-300 cursor-pointer hover:bg-slate-100"
                  data-state={request.approved ? 'selected' : ''}
                  onClick={() => router.push(`/shop/request/${request._id}`)}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{request.items.length}</td>
                  <td className="p-2">{request.status}</td>
                  <td className="p-2">{request.approved ? 'Yes' : 'No'}</td>
                  <td className="p-2 flex flex-col gap-2 md:flex-row">
                    <button
                      onClick={() =>
                        router.push(`/shop/request/${request._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Details
                    </button>
                    <button
                      disabled={request.status === 'cancelled'}
                      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ${
                        request.status === 'cancelled'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;

interface request {
  _id: string;
  quantity: number;
  approved: boolean;
  status: string;
  items: [
    {
      _id: string;
      item: string;
      quantity: number;
    },
  ];
  shop: {
    _id: string;
    name: string;
    shopCode: string;
  };
}
