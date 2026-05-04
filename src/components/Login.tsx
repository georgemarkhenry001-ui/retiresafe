import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        toast.error(
          "Please verify your email before logging in. A new verification email has been sent.",
        );
        return;
      }

      toast.success("Login successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            fullName: user.displayName || "",
            email: user.email || "",
            balance: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        toast.success("Logged in with Google");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Soft background blobs (desktop only — keep mobile light) */}
      <div className="hidden md:block absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />

      <Link
        to="/"
        className="relative inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-indigo-500/[0.08] p-7 sm:p-8"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Shield className="text-white w-5 h-5 relative z-10" />
            <motion.span
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/40 to-blue-400/40 blur-md"
            />
          </motion.div>
          <span className="font-bold text-slate-900 tracking-tight">
            RetireSafe
            <span className="bg-gradient-to-br from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Crypto
            </span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center">
          Welcome back
        </h1>
        <p className="text-slate-600 text-sm text-center mt-1.5 mb-7">
          Log in to access your dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Email */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email
            </span>
            <div className="relative mt-1.5 group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
                required
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </span>
              <button
                type="button"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                onClick={() =>
                  toast(
                    "Contact support at main@retiresafecrypto.com to reset your password.",
                  )
                }
              >
                Forgot?
              </button>
            </div>
            <div className="relative mt-1.5 group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </label>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg disabled:opacity-60 transition mt-2"
          >
            <motion.span
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
            />
            <span className="relative inline-flex items-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Logging in…
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </motion.button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
            or
          </span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 hover:shadow active:scale-[0.99] transition disabled:opacity-60"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-slate-600 text-center">
          New here?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
