import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

function Wrapper() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Wrapper;
