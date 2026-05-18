import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, FolderKanban, Image, BarChart3, ShieldCheck } from "lucide-react";
import { clearSession, getUser } from "../../lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
              Workspace
            </p>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight">
              Welcome back, {user?.fullName || user?.username || "Irawan"}.
            </h1>

            <p className="mt-4 text-gray-400">
              Manage your portfolio content, digital works, and visual stories.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            icon={<FolderKanban className="h-6 w-6" />}
            title="Projects"
            value="Coming Soon"
            desc="Create, edit, and manage digital works, photo stories, and motion works."
          />

          <DashboardCard
            icon={<Image className="h-6 w-6" />}
            title="Media"
            value="Coming Soon"
            desc="Manage cover images, project galleries, and visual assets."
          />

          <DashboardCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics"
            value="Coming Soon"
            desc="Track project views and portfolio content performance."
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">Login system is active.</h2>

          <p className="text-gray-400 leading-relaxed">
            Your personal workspace is ready. The next step is adding project
            management features so portfolio content can be managed from here.
          </p>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ icon, title, value, desc }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </div>

      <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
        {title}
      </p>

      <h2 className="mb-4 text-3xl font-bold">{value}</h2>

      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}