import React from "react";
import { AdminSettings } from "./_components/admin-settings";
import { Logo } from "../_components/Logo";
import { AdminNav } from "./_components/admin-nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-24">
          <Logo />
          <AdminNav className="mx-16" />
          <div className="ml-auto flex items-center space-x-4">
            <AdminSettings />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
