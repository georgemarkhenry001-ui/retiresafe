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
import { ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-600 mb-6">Log in to your account.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 font-medium shadow-sm hover:bg-slate-50 hover:shadow active:scale-[0.99] transition disabled:opacity-60"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}