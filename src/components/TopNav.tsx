import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/account", label: "Account", icon: Landmark },
  { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdrawal", label: "Withdrawal", icon: ArrowUpFromLine },
];

export default function TopNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="relative w-9 h-9 bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Shield className="text-white w-4.5 h-4.5 relative z-10" />
            <motion.span
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.12, 1] }}
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
        </Link>

        {/* Desktop pill nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/80 backdrop-blur p-1 border border-slate-200/60">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }: { isActive: boolean }) =>
                `relative inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="topnav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-md shadow-indigo-500/30"
                    />
                  )}
                  <item.icon className="relative w-4 h-4" />
                  <span className="relative">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout (desktop) */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="hidden md:inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-slate-900/20 transition shrink-0"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>

        {/* Mobile menu trigger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o: boolean) => !o)}
          className="md:hidden relative w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid gap-1.5">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="mt-1 inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
