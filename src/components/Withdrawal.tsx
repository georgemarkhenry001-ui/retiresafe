import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowUpFromLine,
  Wallet,
  Clock,
  Shield,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";
import { auth, db } from "../lib/firebase";
import TopNav from "./TopNav";

const QUICK_PERCENTS = [25, 50, 75, 100];

function FloatingOrbs() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -16, 0], x: [0, 8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, -10, 0], scale: [1, 1.12, 1] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-blue-300/25 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-cyan-200/30 blur-2xl pointer-events-none"
      />
    </>
  );
}

function AnimatedGrid() {
  return (
    <div
      className="hidden md:block absolute inset-0 opacity-[0.08] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap: any) => {
      if (snap.exists()) setBalance(Number(snap.data().balance || 0));
    });
    return () => unsub();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const user = auth.currentUser;
    const value = Number(amount);

    if (!user) {
      toast.error("Please login again");
      return;
    }
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!walletAddress.trim()) {
      toast.error("Enter a wallet address");
      return;
    }
    if (value > balance) {
      toast.error("Amount exceeds your available balance");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawalRequests"), {
        userId: user.uid,
        email: user.email || "",
        amount: value,
        walletAddress: walletAddress.trim(),
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("Withdrawal request submitted");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  }

  const numericAmount = Number(amount) || 0;
  const exceedsBalance = numericAmount > balance && balance > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <TopNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to account
        </Link>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Hero header card — blue gradient with motion graphics */}
              <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/25">
                <FloatingOrbs />
                <AnimatedGrid />

                {/* Animated scanning line */}
                <motion.div
                  animate={{ x: ["-10%", "110%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                />

                {/* Floating sparkle */}
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-6 right-8 text-white/40 pointer-events-none"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>

                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(255,255,255,0.35)",
                        "0 0 0 14px rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shadow-inner"
                  >
                    <ArrowUpFromLine className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                      Cash Out
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold mt-0.5">
                      Withdrawal
                    </h1>
                    <p className="text-indigo-50/90 text-sm mt-1">
                      Send funds from your account to any external wallet.
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative mt-5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-100">
                      Available balance
                    </p>
                    <p className="text-2xl font-bold tabular-nums mt-0.5">
                      $
                      {balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Wallet className="w-8 h-8 text-indigo-100" />
                  </motion.div>
                </motion.div>

                <div className="relative grid grid-cols-3 gap-2 mt-3">
                  {[
                    { icon: Clock, label: "Processing", value: "3 – 5 days" },
                    { icon: Shield, label: "Verified", value: "Manual review" },
                    {
                      icon: CheckCircle2,
                      label: "Limit",
                      value: "Up to balance",
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      whileHover={{ y: -2 }}
                      className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-3 py-2"
                    >
                      <s.icon className="w-4 h-4 text-indigo-100" />
                      <p className="text-[10px] uppercase tracking-wider text-indigo-100 mt-1">
                        {s.label}
                      </p>
                      <p className="text-xs font-semibold">{s.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6"
              >
                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Amount
                    </label>
                    <span className="text-xs text-slate-400">USD</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e: any) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full rounded-2xl border bg-slate-50 pl-9 pr-4 py-4 text-2xl font-bold tabular-nums outline-none transition ${
                        exceedsBalance
                          ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_PERCENTS.map((p, i) => {
                      const computed =
                        balance > 0
                          ? Math.round(((balance * p) / 100) * 100) / 100
                          : 0;
                      const active = String(computed) === amount && computed > 0;
                      return (
                        <motion.button
                          key={p}
                          type="button"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={balance <= 0}
                          onClick={() => setAmount(String(computed))}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            active
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                          }`}
                        >
                          {p === 100 ? "Max" : `${p}%`}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {exceedsBalance && (
                      <motion.p
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 font-semibold"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Exceeds available balance
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Wallet address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Destination wallet address
                  </label>
                  <textarea
                    value={walletAddress}
                    onChange={(e: any) => setWalletAddress(e.target.value)}
                    placeholder="Paste your external wallet address"
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 resize-none font-mono text-sm leading-relaxed transition"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Double-check the address — withdrawals to incorrect
                    addresses cannot be reversed.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-3 flex items-start gap-3">
                  <motion.div
                    animate={{ x: ["-10%", "110%"] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none"
                  />
                  <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-indigo-900">
                      Processing time: 3 – 5 business days
                    </p>
                    <p className="text-xs text-indigo-800/80 mt-0.5">
                      Each withdrawal is manually reviewed for your security.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || exceedsBalance}
                  className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white py-3.5 rounded-2xl font-semibold shadow-md shadow-indigo-500/25 hover:shadow-xl disabled:opacity-60 transition"
                >
                  <motion.span
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                  />
                  <span className="relative inline-flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <ArrowUpFromLine className="w-4 h-4" />
                        Submit withdrawal request
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.15, 0.25, 0.15],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-indigo-300/30 blur-3xl pointer-events-none"
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 240,
                  damping: 16,
                }}
                className="relative w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-5 ring-8 ring-indigo-50"
              >
                <CheckCircle2 className="w-10 h-10 text-indigo-600" />
              </motion.div>
              <h2 className="relative text-3xl font-bold text-slate-900">
                Request submitted
              </h2>
              <p className="relative text-slate-600 mt-3 max-w-xl mx-auto">
                Your withdrawal request has been recorded and is awaiting
                review. You'll receive an update once funds are sent.
              </p>
              <p className="relative text-sm text-slate-500 mt-3">
                Withdrawal processing usually takes 3 to 5 business days.
              </p>
              <Link
                to="/account"
                className="relative mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg transition"
              >
                Back to account
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
