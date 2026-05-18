import { motion } from "framer-motion";
import { Image, UploadCloud } from "lucide-react";

export default function Media() {
  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          Media
        </p>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
          Manage media assets.
        </h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          This section will be used to manage cover images, project galleries,
          and visual assets for your portfolio.
        </p>
      </motion.div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
          <Image className="h-7 w-7" />
        </div>

        <h2 className="mb-3 text-2xl font-bold">Media library coming soon.</h2>

        <p className="mb-8 max-w-2xl text-gray-400 leading-relaxed">
          Later, this area will support uploading and organizing multiple images
          for each project.
        </p>

        <button
          type="button"
          disabled
          className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 font-semibold text-gray-400 opacity-70"
        >
          <UploadCloud className="h-5 w-5" />
          Upload Soon
        </button>
      </div>
    </section>
  );
}