'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SelectLink() {
  const [clicked, setClicked] = useState(false);

  const router = useRouter();

  const sale = () => {
    setClicked(!clicked);

    // route to sales page
    router.push('/shop/sale');
  };
  return (
    <div className="pl-2">
      <button onClick={sale} className="hover:underline">
        Sales
      </button>
      <div className={`dropdown ${clicked ? '' : 'hidden'} flex flex-col ml-3`}>
        <Link href="/shop/sale/create">
          <li className="p-2 hover:underline">Create Sale</li>
        </Link>
      </div>
    </div>
  );
}

export default SelectLink;
