'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Page() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    //fetch customers from api/customers
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers');
        setCustomers(response.data.customers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
  });
  return (
    <div className="p-5 m-7 h-screen text-slate-950">
      <div>
        <h1>WELCOME TO CUSTOMERS PAGE.</h1>

        {/* Render customers with border removed table */}

        {/* Render customers with border removed table */}
        <div>
          {customers &&
            customers?.map((customer: user) => (
              <table
                key={customer._id}
                className="border-1 border-slate-90 p-5 m-5 w-full"
              >
                <thead>
                  <tr className="text-left font-bold bg-slate-300">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{customer.firstName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.level}</td>
                  </tr>
                </tbody>
              </table>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;

interface user {
  _id: string;
  firstName: string;
  email: string;
  phone: string;
  level: string;
}
