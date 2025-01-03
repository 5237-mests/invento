'use client';
import { useEffect, useState } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<request[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/request');
      setRequests(response.data.reqs);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await axios.put(`/api/request/${id}/approve`);
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await axios.put(`/api/admin/requests/${id}/reject`);
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-3">
      <h1 className="text-2xl font-bold mb-4">Admin Requests Page</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="w-full md:w-11/12 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left font-bold bg-slate-300">
                <th className="p-2">Shop Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Approved</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b border-slate-300 cursor-pointer hover:bg-slate-100"
                >
                  <td className="p-2">{request.shop.name}</td>
                  <td className="p-2">{request.status}</td>
                  <td className="p-2">{request.approved ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    <button
                      disabled={request.approved}
                      onClick={() => handleApproveRequest(request._id)}
                      className={`hidden bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ${
                        request.approved ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <DoneOutlineIcon />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/request/${request._id}`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                    >
                      <RateReviewIcon />
                    </button>
                    <button
                      disabled={request.status === 'cancelled'}
                      onClick={() => handleRejectRequest(request._id)}
                      className={`hidden bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ${
                        request.status === 'cancelled'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <CloseIcon />
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

export default AdminRequestsPage;

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
