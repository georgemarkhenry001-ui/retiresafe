import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../lib/firebase";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        fullName,
        email,
        balance: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await sendEmailVerification(cred.user);

      toast.success("Account created. Please verify your email before login. Check your primary inbox or spam folder.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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

      toast.success("Signed in with Google successfully.");
      navigate("/account");
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

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Create account
        </h1>
        <p className="text-slate-600 mb-6">Open your account in a few steps.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            required
          />
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
            minLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-500">or</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mt-4 inline-flex items-center justify-center gap-3 border border-slate-300 bg-white text-slate-700 py-3 rounded-xl font-semibold shadow-sm hover:bg-slate-50 hover:shadow active:scale-[0.99] transition disabled:opacity-60"
        >
          <FcGoogle size={20} />
          {loading ? "Processing..." : "Continue with Google"}
        </button>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}