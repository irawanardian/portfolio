import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <header className="fixed left-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-neutral-950/90 px-5 backdrop-blur-xl lg:hidden">
        <div>
          <p className="text-lg font-bold tracking-tighter">
            IRAWAN<span className="text-gray-500">.</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">
            Workspace
          </p>
        </div>

        <button
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
          className="rounded-full border border-white/10 p-2 text-white"
          aria-label="Toggle sidebar"
        >
          {mobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      <main className="min-h-screen pt-16 lg:pl-72 lg:pt-0">
        {children}
      </main>
    </div>
  );
}