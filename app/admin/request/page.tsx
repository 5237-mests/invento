'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);

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
      await axios.put(`/api/request/${id}/approve`); // Adjust endpoint for approval
      fetchRequests(); // Refresh requests after update
    } catch (error) {
      console.error('Error approving request:', error);
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

  return (
    <div className="min-h-screen flex items-center flex-col">
      <h1>Admin Requests Page</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="w-11/12">
          <table className="w-full">
            <thead>
              <tr className="text-left font-bold bg-slate-300">
                <th className="p-2">Shop Name</th>
                <th>Status</th>
                <th>Aproved</th>
                <th>Action</th>
                <th>Reject</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request: request) => (
                <tr
                  key={request._id}
                  className="border-b border-slate-300"
                  data-state={request.approved ? 'selected' : ''}
                  onClick={() => router.push(`/admin/request/${request._id}`)}
                >
                  <td className="p-2">{request.shop.name}</td>
                  <td>{request.status}</td>
                  <td>{request.approved ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      disabled={request.approved}
                      onClick={() => handleApproveRequest(request._id)}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded ${
                        request.approved ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Approve
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={request.status === 'cancelled'}
                      className={`bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded ${
                        request.status === 'cancelled'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      Reject
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
