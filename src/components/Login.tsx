import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
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

        toast.success("Login successful");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
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

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-500">or</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-60"
        >
          <svg
            viewBox="0 0 533.5 544.3"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-18.2-1.5-36.2-4.3-53.6H272.1v101.5h147.1c-6.3 34.3-25.2 63.3-53.8 82.7v68.7h86.9c50.7-46.7 80.3-115.5 80.3-199.3z"
            />
            <path
              fill="#34A853"
              d="M272.1 544.3c72.7 0 133.7-24.1 178.3-65.6l-86.9-68.7c-24.2 16.2-55.4 25.7-91.4 25.7-70.3 0-129.9-47.5-151.3-111.5H30.6v69.9c44.7 88.7 136.4 150.2 241.5 150.2z"
            />
            <path
              fill="#FBBC05"
              d="M120.8 324.2c-10.3-30.7-10.3-63.8 0-94.5V159.8H30.6c-43.8 87.5-43.8 191.2 0 278.7l90.2-69.9z"
            />
            <path
              fill="#EA4335"
              d="M272.1 108.3c39.5 0 75 13.6 103.1 40.5l77.3-77.3C404.9 24.4 344 0 272.1 0 167 0 75.3 61.5 30.6 150.2l90.2 69.9c21.3-64 80.9-111.8 151.3-111.8z"
            />
          </svg>
          {loading ? "Processing..." : "Continue with Google"}
        </button>

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