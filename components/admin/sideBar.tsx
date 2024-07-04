import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import sidePic from '@/public/hamburgor.png';

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
                  <Link href="/admin">Admin</Link>
                </h1>
              </div>
              <div className="p-4">
                <ul>
                  <Link href="/admin/user">
                    <li className={`p-2 hover:underline`}>User</li>
                  </Link>

                  <Link href="/admin/items">
                    <li className={`p-2 hover:underline`}>Items</li>
                  </Link>

                  <Link href="/admin/store">
                    <li className={`p-2 hover:underline`}>Store</li>
                  </Link>

                  <Link href="/admin/shop">
                    <li className={`p-2 hover:underline`}>Shop</li>
                  </Link>
                </ul>
              </div>
              <div className="mt-auto p-4">
                <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SideBar;
