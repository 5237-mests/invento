'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

const Page = ({ params }: { params: { id: string } }) => {
  const [request, setRequest] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      axios
        .get(`/api/request?id=${params.id}`)
        .then((response) => {
          setRequest(response.data.req);
          setLoading(false);
        })
        .catch((error) => {
          setError(
            error.response
              ? error.response.data.error
              : 'Failed to fetch request details',
          );
          setLoading(false);
        });
    }
  }, [params.id]);

  const cancelRequest = async () => {
    try {
      await axios.patch(`/api/request/?id=${request?._id}`, {
        status: 'cancelled',
      });
      router.push('/admin/request');
    } catch (error) {
      console.error('Error cancelling request:', error);
      setError('Failed to cancel the request');
    }
  };

  const approveRequest = async () => {
    try {
      await axios.post(`/api/approve_request`, {
        id: request?._id,
      });
      router.push('/admin/request');
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve the request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-950">
        <Spinner />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Details</h1>
      <div className="flex mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/admin/request/edit/${request?._id}`)}
            className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ${request?.status === 'cancelled' || request?.status === 'completed' ? 'hidden' : ''}`}
          >
            Edit
          </button>
          <button
            onClick={cancelRequest}
            className={`bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded ${request?.status === 'cancelled' || request?.status === 'completed' ? 'hidden' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={approveRequest}
            className={`bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded ${request?.approved || request?.status === 'cancelled' || request?.status === 'completed' ? 'hidden' : ''}`}
          >
            Approve
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <p>
          <strong>Status:</strong> {request?.status}
        </p>
        <p>
          <strong>Approved:</strong> {request?.approved ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Approval Date:</strong>{' '}
          {request?.approvalDate
            ? new Date(request.approvalDate).toLocaleString()
            : 'N/A'}
        </p>
        <p>
          <strong>Shop:</strong> {request?.shop.name}
        </p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Items</h2>

      <ul className="space-y-4">
        {request?.items.map((item) => (
          <li key={item.item._id} className="bg-white shadow-md rounded p-4">
            <p>
              <strong>Item:</strong> {item.item.name}
            </p>
            <p>
              <strong>Product Code:</strong> {item.item.productCode}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;

interface RequestType {
  _id: string;
  quantity: number;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  items: {
    item: {
      _id: string;
      name: string;
      productCode: string;
    };
    quantity: number;
  }[];
  shop: {
    _id: string;
    name: string;
  };
  approvalDate?: Date;
}
