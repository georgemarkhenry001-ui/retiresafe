import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function TopNav() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            R
          </div>
          <span className="font-bold text-slate-900">
            RetireSafe<span className="text-indigo-600">Crypto</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/account"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <Landmark className="w-4 h-4" />
            Account
          </Link>

          <Link
            to="/deposit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Deposit
          </Link>

          <Link
            to="/withdrawal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Withdrawal
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
