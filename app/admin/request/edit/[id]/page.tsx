// 'use client';
// import { ChangeEvent, useEffect, useState } from 'react';
// import axios from 'axios';

// const Page = ({ params }: { params: { id: string } }) => {
//   // const [request, setRequest] = useState<request | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState<request>({} as request);

//   useEffect(() => {
//     if (params.id) {
//       setLoading(true);
//       axios
//         .get(`/api/request?id=${params.id}`)
//         .then((response) => {
//           // setRequest(response.data.req);
//           setFormData(response.data.req);
//           setLoading(false);
//         })
//         .catch((error) => {
//           setError(
//             error.response
//               ? error.response.data.error
//               : 'Failed to fetch request details',
//           );
//           setLoading(false);
//         });
//     }
//   }, [params.id]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     if (type === 'checkbox') {
//       setFormData((prev: request) => ({
//         ...prev,
//         [name]: checked,
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleItemChange = (
//     index: number,
//     e: ChangeEvent<HTMLInputElement>,
//   ) => {
//     const { name, value } = e.target;
//     const updatedItems: UpdatedItems = [...formData.items];
//     updatedItems[index][name] = value;
//     setFormData((prev) => ({ ...prev, items: updatedItems }) as request);
//   };

//   const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       if (!formData) return;
//       if (formData.approved) {
//         formData.status = 'approved';
//       }
//       console.log(formData);
//       // await axios.patch(`/api/request?id=${id}`, formData);
//       // router.push(`/requests/${id}`);
//     } catch (error) {
//       setError(
//         error.response ? error.response.data.error : 'Failed to update request',
//       );
//     }
//   };
//   type UpdatedItems = {
//     [key: string]: unknown;
//     item: {
//       _id: string;
//       name: string;
//       productCode: string;
//     };
//     quantity: number;
//   }[];
//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Edit Request</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Status:
//           </label>
//           <input
//             type="text"
//             disabled
//             value={formData.status}
//             className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             name="approved"
//             checked={formData.approved}
//             onChange={handleChange}
//             className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//           />
//           <label className="ml-2 block text-sm font-medium text-red-700">
//             Approve
//           </label>
//         </div>
//         <h2 className="text-xl font-semibold mb-2">Items</h2>
//         {formData.items.map((item, index) => (
//           <div key={item.item._id} className="space-y-2">
//             <p>
//               <strong>Item:</strong> {item.item.name}
//             </p>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={item.quantity}
//                 onChange={(e) => handleItemChange(index, e)}
//                 className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>
//         ))}
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Page;

// interface request {
//   _id: string;
//   quantity: number;
//   approved: boolean;
//   status: 'pending' | 'approved' | 'rejected' | 'completed';
//   items: [
//     {
//       item: {
//         _id: string;
//         name: string;
//         productCode: string;
//       };
//       quantity: number;
//     },
//   ];
//   shop: {
//     _id: string;
//     name: string;
//   };
//   approvalDate?: Date;
// }

'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState<request>({} as request);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/api/request?id=${id}`)
        .then((response) => {
          setFormData(response.data.req);
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
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev: request) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedItems: UpdatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }) as request);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.approved) {
        formData.status = 'approved';
      }
      await axios.patch(`/api/request?id=${id}`, formData);
      router.push(`/admin/request/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(
        error.response ? error.response.data.error : 'Failed to update request',
      );
    }
  };

  type UpdatedItems = {
    [key: string]: unknown;
    item: {
      _id: string;
      name: string;
      productCode: string;
    };
    quantity: number;
  }[];

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status:
          </label>
          <input
            type="text"
            disabled
            value={formData.status}
            className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="approved"
            checked={formData.approved}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm font-medium text-red-700">
            Approve
          </label>
        </div>
        <h2 className="text-xl font-semibold mb-2">Items</h2>
        {formData.items.map((item, index) => (
          <div key={item.item._id} className="space-y-2">
            <p>
              <strong>Item:</strong> {item.item.name}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Page;

interface request {
  _id: string;
  quantity: number;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  items: [
    {
      item: {
        _id: string;
        name: string;
        productCode: string;
      };
      quantity: number;
    },
  ];
  shop: {
    _id: string;
    name: string;
  };
  approvalDate?: Date;
}