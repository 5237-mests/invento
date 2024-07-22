'use client';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import sidePic from '@/public/hamburgor.png';
import logout from '@/lib/logout';

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
            <SheetClose asChild>
              <div className="flex flex-col h-full">
                <div className="p-4">
                  <h1 className="text-2xl font-bold">
                    <Link href="/admin">Admin</Link>
                  </h1>
                </div>
                <div className="p-4">
                  <ul>
                    <SheetClose asChild>
                      <Link href="/admin/user">
                        <li className={`p-2 hover:underline`}>User</li>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/admin/items">
                        <li className={`p-2 hover:underline`}>Items</li>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/admin/store">
                        <li className={`p-2 hover:underline`}>Store</li>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/admin/shop">
                        <li className={`p-2 hover:underline`}>Shop</li>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/admin/request">
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
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SideBar;
