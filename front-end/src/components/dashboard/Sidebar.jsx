import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Image,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";
import { clearSession, getUser } from "../../lib/auth";

const menuItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
  label: "Projects",
  to: "/projects",
  icon: <FolderKanban className="h-5 w-5" />,
},
{
  label: "Media",
  to: "/media",
  icon: <Image className="h-5 w-5" />,
},
{
  label: "Analytics",
  to: "/analytics",
  icon: <BarChart3 className="h-5 w-5" />,
},
];

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    if (onCloseMobile) onCloseMobile();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-neutral-950/95 px-5 py-6 text-white backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="text-2xl font-bold tracking-tighter"
          >
            IRAWAN<span className="text-gray-500">.</span>
          </Link>

          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-600">
            Workspace
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const active =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-5">
          <div className="mb-4 rounded-2xl bg-white/[0.04] p-4">
            <p className="text-sm font-semibold text-white">
              {user?.fullName || user?.username || "Irawan"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {user?.email || "Personal Workspace"}
            </p>
          </div>

          <Link
            to="/"
            onClick={onCloseMobile}
            className="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Home className="h-5 w-5" />
            Back to Site
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}