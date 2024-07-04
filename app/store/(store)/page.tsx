"use client";
// const Store = () => {
//     // want to protect this page for unlogged users and redirect to login page
//   const user = localStorage.getItem('user')
//   if (!user) {
//     window.location.href = '/login'
//     return
//   }

//   // user is logged in
//   // check user is shopkeeper
//   // this page is only for shopkeeper
//   // if not shopkeeper or admin redirect to unauthorized page
//   const data = JSON.parse(user)
//   if (data.user.role !== 'storekeeper' && data.user.role !== 'admin') {
//     window.location.href = '/unauthorized'
//     return
//   }

//   return <div>Store</div>;
// };
// export default Store;

import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({
    storeCode: "",
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchStores() {
      const response = await axios.get("/api/store");
      setStores(response.data.stores);
    }

    fetchStores();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/store", {
        storeCode: newStore.storeCode,
        name: newStore.name,
        description: newStore.description,
        location: {
          street: newStore.street,
          city: newStore.city,
          state: newStore.state,
        },
        phone: newStore.phone,
      });
      setStores([...stores, response.data.stores]);
      setNewStore({
        storeCode: "",
        name: "",
        description: "",
        street: "",
        city: "",
        state: "",
        phone: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Stores</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 text-slate-950"
      >
        <input
          type="text"
          name="storeCode"
          placeholder="Store Code"
          value={newStore.storeCode}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStore.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newStore.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={newStore.street}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newStore.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={newStore.state}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newStore.phone}
          onChange={handleInputChange}
        />
        <button type="submit">Add Store</button>
      </form>

      <ul>
        {stores.map((store) => (
          <li key={store._id}>
            <h2>{store.name}</h2>
            <p>{store.description}</p>
            <p>
              {store.location.street}, {store.location.city},{" "}
              {store.location.state}
            </p>
            <p>{store.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
