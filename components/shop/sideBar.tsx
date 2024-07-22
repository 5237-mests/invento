'use client';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import Image from 'next/image';
import sidePic from '@/public/hamburgor.png';
import logout from '@/lib/logout';
import SelectLink from '../SelectLink';

function SideBar() {
  return (
    <div className="w-[50px] p-1 sidebar-icon">
      <Sheet>
        <SheetTrigger className="text-white">
          <Image
            src={sidePic}
            alt="hamburger"
            width={50}
            height={50}
            className="text-white"
          />
        </SheetTrigger>
        <SheetContent className="bg-slate-800 w-[300px]" side={'left'}>
          <div className="bg-slate-800 mobile-sidebar text-white">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <h1 className="text-2xl font-bold">
                  <Link href="/shop">Shop</Link>
                </h1>
              </div>
              <div className="p-4">
                <ul>
                  <SheetClose asChild>
                    <Link href="/shop/items">
                      <li className={`p-2 hover:underline`}>Items</li>
                    </Link>
                  </SheetClose>

                  {/* Sales links */}
                  <SelectLink />

                  <SheetClose asChild>
                    <Link href="/shop/request">
                      <li className={`p-2 hover:underline`}>Request</li>
                    </Link>
                  </SheetClose>
                </ul>
              </div>
              <div className="mt-auto p-4">
                <SheetClose asChild>
                  <button
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SideBar;
