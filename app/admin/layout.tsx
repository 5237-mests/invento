import Links from '@/components/Links';
import MainSideBar from '@/components/admin/MainSideBar';
import SideBar from '@/components/admin/sideBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-slate-100 min-h-screen">
        {/* Sidebar (hidden on mobile) */}
        <MainSideBar />

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
