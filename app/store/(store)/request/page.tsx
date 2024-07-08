// 'use client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const Page = () => {
//   const [requests, setRequests] = useState([]);

//   const router = useRouter();

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const response = await axios.get('/api/request');
//       setRequests(response.data.reqs);
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//     }
//   };

//   const handleRejectRequest = async (id: string) => {
//     try {
//       await axios.put(`/api/admin/requests/${id}/reject`); // Adjust endpoint for rejection
//       fetchRequests(); // Refresh requests after update
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center flex-col">
//       {requests.length === 0 ? (
//         <p>No requests found.</p>
//       ) : (
//         <div className="w-11/12">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left font-bold bg-slate-300">
//                 <th>No:</th>
//                 <th>Items</th>
//                 <th>Status</th>
//                 <th>Aproved</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((request: request, index) => (
//                 <tr
//                   key={request._id}
//                   className="border-b border-slate-300"
//                   data-state={request.approved ? 'selected' : ''}
//                   onClick={() => router.push(`/store/request/${request._id}`)}
//                 >
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">{request.items.length}</td>
//                   <td>{request.status}</td>
//                   <td>{request.approved ? 'Yes' : 'No'}</td>
//                   <td className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         router.push(`/store/request/${request._id}`)
//                       }
//                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
//                     >
//                       Details
//                     </button>
//                     <button
//                       disabled={request.status === 'cancelled'}
//                       className={`bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded ${
//                         request.status === 'cancelled'
//                           ? 'opacity-50 cursor-not-allowed'
//                           : ''
//                       }`}
//                       onClick={() => handleRejectRequest(request._id)}
//                     >
//                       Cancel
//                     </button>
//                     <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded">
//                       Complete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;

// interface request {
//   _id: string;
//   quantity: number;
//   approved: boolean;
//   status: string;
//   items: [
//     {
//       _id: string;
//       item: string;
//       quantity: number;
//     },
//   ];
//   shop: {
//     _id: string;
//     name: string;
//     shopCode: string;
//   };
// }

'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Request {
  _id: string;
  quantity: number;
  approved: boolean;
  status: string;
  items: {
    _id: string;
    item: string;
    quantity: number;
  }[];
  shop: {
    _id: string;
    name: string;
    shopCode: string;
  };
}

const Page = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/request');
      setRequests(response.data.reqs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch requests');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex items-center flex-col">
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="w-11/12">
          <table className="w-full">
            <thead>
              <tr className="text-left font-bold bg-slate-300">
                <th>No:</th>
                <th>Items</th>
                <th>Status</th>
                <th>Approved</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request._id}
                  className="border-b border-slate-300"
                  data-state={request.approved ? 'selected' : ''}
                  onClick={() => router.push(`/store/request/${request._id}`)}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{request.items.length}</td>
                  <td>{request.status}</td>
                  <td>{request.approved ? 'Yes' : 'No'}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/store/request/${request._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                    >
                      Details
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
