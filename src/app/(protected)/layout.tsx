import React from "react";
import { Logo } from "./_components/Logo";
import { Nav } from "./admin/_components/admin-nav";
import { AdminSettings } from "./admin/_components/admin-settings";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 border-b">
        <div className="flex h-16 items-center px-8">
          <Logo />
          <Nav className="mx-16" />
          <div className="ml-auto flex items-center space-x-4">
            <AdminSettings />
          </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
    </div>
  );
};

export default Layout;