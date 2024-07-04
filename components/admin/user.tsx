import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function User() {
  const router = useRouter();
  const [users, setusers] = useState<any>();
  //  want to do crud on User model for admin purpose
  //  get all users
  //  delete user
  //  update user
  //  create user

  const getAllUsers = () => {
    fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setusers(data.users))
      .catch((err) => console.log(err));
  };

  const deleteUser = (id: any) => {
    fetch("/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.status == 200) {
          getAllUsers();
        }
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="p-4 ml-3 w-full h-screen">
      <div className="user-table">
        <div className="flex justify-between py-1">
          <p className="text-slate-950">total users: {users && users.length}</p>
          {/* <p>create user</p> */}
          {/* create user button */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link href="/admin/createUser">Create User</Link>
          </button>
          {/* create user button end */}
        </div>
        {/* list user inside table */}
        <table className="table text-slate-950 w-full">
          <thead className="text-left">
            <tr className="bg-blue-200">
              <th className="py-3">Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-centerr">
            {users &&
              users.map((user: any) => (
                <tr key={user._id} className="hover:bg-blue-100">
                  <td onClick={() => router.push(`/admin/user/${user._id}`)}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td onClick={() => router.push(`/admin/user/${user._id}`)}>
                    {user.username}
                  </td>
                  <td onClick={() => router.push(`/admin/user/${user._id}`)}>
                    {user.email}
                  </td>
                  <td onClick={() => router.push(`/admin/user/${user._id}`)}>
                    {user.role}
                  </td>
                  <td className="w-ful">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
