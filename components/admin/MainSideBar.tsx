'use client';
import LogoutButton from '@/components/logoutButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainSideBar() {
  const router = usePathname();
  const currentPath = router;

  const getLinkClasses = (path: string) => {
    if (currentPath === path) {
      return 'p-2 hover:underline text-blue-500 underline';
    } else {
      return 'p-2 hover:underline';
    }
  };

  return (
    <div className="hidden md:flex md:w-64 bg-slate-800 sidebar text-white">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-2xl font-bold">
            <Link href="/admin">Admin</Link>
          </h1>
        </div>
        <div className="p-4">
          <ul>
            <Link href="/admin/user">
              <li className={`${getLinkClasses('/admin/user')}`}>User</li>
            </Link>

            <Link href="/admin/items">
              <li className={`${getLinkClasses('/admin/items')}`}>Items</li>
            </Link>

            <Link href="/admin/store">
              <li className={`${getLinkClasses('/admin/store')}`}>Store</li>
            </Link>

            <Link href="/admin/shop">
              <li className={`${getLinkClasses('/admin/shop')}`}>Shop</li>
            </Link>

            <Link href="/admin/request">
              <li className={`p-2 hover:underline`}>Request</li>
            </Link>

            <Link href="/admin/customers">
              <li className={`${getLinkClasses('/admin/customers')}`}>
                Customers
              </li>
            </Link>
          </ul>
        </div>
        <div className="mt-auto p-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
