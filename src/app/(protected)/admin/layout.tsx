import React from "react";
import { AdminSettings } from "./_components/admin-settings";
import { Logo } from "../_components/Logo";
import { AdminNav } from "./_components/admin-nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="h-16 border-b">
        <div className="flex h-16 items-center px-8">
          <Logo />
          <AdminNav className="mx-16" />
          <div className="ml-auto flex items-center space-x-4">
            <AdminSettings />
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)]">{children}</div>
    </div>
  );
};

export default Layout;
