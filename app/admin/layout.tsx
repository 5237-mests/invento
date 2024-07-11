import Links from '@/components/Links';
import SideBar from '@/components/admin/sideBar';
import LogoutButton from '@/components/logoutButton';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-slate-100 min-h-screen">
        {/* Sidebar (hidden on mobile) */}
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

                <Link href="/admin/request">
                  <li className={`p-2 hover:underline`}>Request</li>
                </Link>
              </ul>
            </div>
            <div className="mt-auto p-4">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:flex-1 md:ml-64 bg-white ">
          <div className="p-6 md:mt-10 md:text-slate-800 flex justify-between main-side">
            <div>
              <Links />
            </div>

            <div className="md:hidden">
              <SideBar />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
