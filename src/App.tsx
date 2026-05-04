import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Menu,
  X,
  Home,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import { cn } from "./lib/utils";
import { auth } from "./lib/firebase";
import { useAuth } from "./hooks/useAuth";

// Landing page components
import Hero from "./components/Hero";
import ReviewsStars from "./components/ReviewsStars";
import HowItWorks from "./components/HowItWorks";
import InvestmentApproach from "./components/InvestmentApproach";
import ProfitCalculator from "./components/ProfitCalculator";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import InvestmentPlans from "./components/InvestmentPlans";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";

// Admin
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";

// User pages
import Login from "./components/Login";
import Signup from "./components/Signup";
import AccountOverview from "./components/AccountOverview";
import Deposit from "./components/Deposit";
import Withdrawal from "./components/Withdrawal";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar({ onContactClick }: { onContactClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHomePage = location.pathname === "/";

  const isSpecialPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/account" ||
    location.pathname === "/deposit" ||
    location.pathname === "/withdrawal";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  if (isSpecialPage) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl py-3 border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
          : "bg-transparent py-5 border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Shield className="text-white w-5 h-5 relative z-10" />
            <motion.span
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/40 to-blue-400/40 blur-md"
            />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            RetireSafe
            <span className="bg-gradient-to-br from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Crypto
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          {/* Section anchors — grouped in a segmented pill */}
          {isHomePage && (
            <nav className="flex items-center gap-0.5 rounded-full bg-slate-100/80 backdrop-blur p-1 border border-slate-200/60">
              {[
                { href: "#approach", label: "Approach" },
                { href: "#calculator", label: "Calculator" },
                { href: "#faq", label: "FAQ" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-white rounded-full transition-colors group"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md shadow-indigo-500/25" />
                  <span className="relative">{link.label}</span>
                </a>
              ))}
            </nav>
          )}

          {/* Account nav (logged in) — segmented pill with active highlight */}
          {user && (
            <nav className="flex items-center gap-0.5 rounded-full bg-slate-100/80 backdrop-blur p-1 border border-slate-200/60">
              {!isHomePage && (
                <Link
                  to="/"
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              )}

              {[
                { to: "/account", label: "Account", icon: Landmark },
                { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
                { to: "/withdrawal", label: "Withdrawal", icon: ArrowUpFromLine },
              ].map((item) => {
                const isActive = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-indigo-600",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-pill"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-md shadow-indigo-500/30"
                      />
                    )}
                    <Icon className="relative w-4 h-4" />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right-side action(s) */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              >
                Login
              </Link>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContactClick}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-500/30"
              >
                <motion.span
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                />
                <span className="relative">Contact Us</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-slate-900/20 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          )}
        </div>

        <button
          className="lg:hidden text-slate-900 p-1.5 -mr-1.5"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {!user ? (
                <>
                  <a
                    href="#approach"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Approach
                  </a>
                  <a
                    href="#calculator"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Calculator
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    FAQ
                  </a>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      onContactClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-center"
                  >
                    Contact Us
                  </button>
                </>
              ) : (
                <>
                  {!isHomePage && (
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-slate-600"
                    >
                      Home
                    </Link>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Account Overview
                  </Link>
                  <Link
                    to="/deposit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/withdrawal"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    Withdrawal
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-center"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LandingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onContactClick={() => setIsContactModalOpen(true)} />
      <main>
        <Hero onContactClick={() => setIsContactModalOpen(true)} />
        <ReviewsStars />
        <HowItWorks />
        <InvestmentApproach />
        <InvestmentPlans
          onGetStartedClick={() => setIsContactModalOpen(true)}
        />
        <ProfitCalculator />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdrawal"
          element={
            <ProtectedRoute>
              <Withdrawal />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}