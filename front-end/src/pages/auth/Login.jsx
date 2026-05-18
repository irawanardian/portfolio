import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, LogIn, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { saveSession } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      saveSession(result.token, result.user);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Lock className="h-6 w-6 text-blue-300" />
            </div>

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
              Workspace
            </p>

            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Sign in to your portfolio.
            </h1>

            <p className="mb-8 text-gray-400 leading-relaxed">
              Manage your digital works, visual stories, and project content
              from one personal workspace.
            </p>

            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-white/40"
                  placeholder="irawan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-white/40"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-bold text-black transition-all hover:scale-[1.02] hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  );
}