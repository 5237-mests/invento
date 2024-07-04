'use client';
// create dynamic page for user
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent } from 'react';

type UpdatedField = {
  [key: string]: boolean;
};

// type User = {
//   [key: string]: string | number;
// };

interface user {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}
export default function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState({} as user);

  const router = useRouter();

  const [updatedField, setUpdatedField] = useState<UpdatedField>({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    phone: false,
    role: false,
  });
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });
  //  want to do crud on User model for admin purpose
  // get user by id

  useEffect(() => {
    fetch(`/api/user/?id=${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.log(err));
  }, []);

  // delete user
  const deleteUser = () => {
    fetch('/api/user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: params.id }),
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  // update user
  const updateUser = () => {
    const updatedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role,
    };

    // filter updated field
    // Object.keys(updatedUser).forEach((key) => {
    //   if (!updatedField[key]) {
    //     delete updatedUser[key];
    //   }
    // });

    fetch(`/api/user/?id=${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((data) => {
        if (data.status === 200) {
          router.push('/admin/user/' + params.id);
        } else if (data.status === 400) {
          data.json().then((data) => {
            console.log(data);
            if (data.field === 'password') {
              setError({ ...error, password: data.msg });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setUpdatedField({ ...updatedField, [e.target.name]: true });
    setError({ ...error, [e.target.name]: '' });
  };

  const role = ['admin', 'user', 'shopkeeper', 'storekeeper'];

  return (
    <div className="m-3 p-3">
      <div>
        <div>
          <form action={updateUser} className="text-slate-950">
            <div className="flex justify-between py-1 text-slate-950">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                update user
              </button>
              <button
                onClick={() => deleteUser()}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                delete user
              </button>
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">First name</label>
              <br />
              <input
                className="my-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="firstName"
                value={user && user.firstName}
                onChange={onChange}
              />
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">Last name</label>
              <br />
              <input
                className="mb-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="lastName"
                value={user && user.lastName}
                onChange={onChange}
              />
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">User name</label>
              <br />
              <input
                className="mb-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="username"
                value={user && user.username}
                onChange={onChange}
              />
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">Email</label>
              <br />
              <input
                className="mb-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="email"
                value={user && user.email}
                onChange={onChange}
              />
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">Phone</label>
              <br />
              <input
                className="mb-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="phone"
                value={user && user.phone}
                onChange={onChange}
              />
            </div>

            <div className="py-1 mt-2">
              <label className="text-slate-950">Password</label>
              <br />
              <span className="text-red-500">{error && error.password}</span>
              <input
                className="mb-1 p-2 border-2 border-slate-350 rounded w-full focus:outline-slate-400"
                type="text"
                name="password"
                value={user && user.password}
                onChange={onChange}
              />
            </div>

            <div className="flex justify-betweenn py-1 mt-2">
              <label className="text-slate-950 p-2">Role:</label>
              <select
                name="role"
                id="role"
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="mb-1 p-2 border-2 border-slate-350 rounded focus:outline-slate-400"
              >
                <option value="user">{user && user.role}</option>
                {role.map((rol) => {
                  if (rol !== user?.role) {
                    return (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
