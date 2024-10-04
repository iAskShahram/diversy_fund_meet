import { AdminSettings } from "./_components/AdminSettings";
import { Logo } from "./_components/Logo";
import { MainNav } from "./_components/MainNav";

const Page = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Logo />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <AdminSettings />
        </div>
      </div>
    </div>
  );
};

export default Page;
