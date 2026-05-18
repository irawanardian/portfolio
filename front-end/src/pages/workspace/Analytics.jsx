import { motion } from "framer-motion";
import { BarChart3, Eye } from "lucide-react";

export default function Analytics() {
  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          Analytics
        </p>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
          Track portfolio activity.
        </h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          This section will show project views, content performance, and basic
          analytics from your portfolio.
        </p>
      </motion.div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
          <BarChart3 className="h-7 w-7" />
        </div>

        <h2 className="mb-3 text-2xl font-bold">Analytics coming soon.</h2>

        <p className="mb-8 max-w-2xl text-gray-400 leading-relaxed">
          Later, this area will display view counts and simple insights for each
          project.
        </p>

        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-gray-400">
          <Eye className="h-5 w-5" />
          View tracking is prepared in the database.
        </div>
      </div>
    </section>
  );
}