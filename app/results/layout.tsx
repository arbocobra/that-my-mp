import SideNav from '@/app/ui/dashboard/sidenav';
import ThatMyMPLogo from '@/app/ui/that-my-mp-logo';

export const experimental_ppr = true;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col md:overflow-hidden">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-red-500 p-4 md:h-36">
        <ThatMyMPLogo />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
export default Layout;