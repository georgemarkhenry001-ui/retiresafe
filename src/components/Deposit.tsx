import { useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  CheckCircle2,
  Copy,
  ArrowLeft,
  Shield,
  Clock,
  Wallet,
  ArrowDownToLine,
  Bitcoin,
  Sparkles,
  Building2,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";
import { auth, db } from "../lib/firebase";
import TopNav from "./TopNav";

const paymentMethods = {
  BTC: {
    label: "Bitcoin",
    network: "Bitcoin Network",
    walletAddress: "bc1qr9mxx5gma7gg54x3qtpk5ktnjj5f3pg7u83rgp",
    color: "#f7931a",
    bg: "from-orange-50 to-amber-50",
    ring: "ring-orange-500",
  },
  ETH: {
    label: "Ethereum",
    network: "Ethereum Network",
    walletAddress: "0x2412db2c0AaD514d5e971c2cd97F92D5495594F6",
    color: "#627eea",
    bg: "from-indigo-50 to-blue-50",
    ring: "ring-indigo-500",
  },
  USDT: {
    label: "Tether",
    network: "ERC20",
    walletAddress: "0x2412db2c0AaD514d5e971c2cd97F92D5495594F6",
    color: "#26a17b",
    bg: "from-emerald-50 to-teal-50",
    ring: "ring-emerald-500",
  },
} as const;

type AssetKey = keyof typeof paymentMethods;
type PaymentChoice = "" | AssetKey | "BANK";

const SUPPORT_EMAIL = "main@retiresafecrypto.com";
const SUPPORT_WHATSAPP = "+1 417 604 1178";
const SUPPORT_WHATSAPP_LINK = "https://wa.me/14176041178";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

function FloatingOrbs() {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -16, 0],
          x: [0, 8, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 14, 0],
          x: [0, -10, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-blue-300/25 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, -8, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
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
      className="absolute inset-0 opacity-[0.08] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [cryptoType, setCryptoType] = useState<PaymentChoice>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedMethod =
    cryptoType && cryptoType in paymentMethods
      ? paymentMethods[cryptoType as AssetKey]
      : null;

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
    if (!cryptoType) {
      toast.error("Select a payment method");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "depositRequests"), {
        userId: user.uid,
        email: user.email || "",
        amount: value,
        cryptoType,
        walletAddressShown:
          cryptoType === "BANK" ? "" : selectedMethod?.walletAddress || "",
        network:
          cryptoType === "BANK"
            ? "Bank Transfer (manual)"
            : selectedMethod?.network || "",
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success(
        cryptoType === "BANK"
          ? "Request received — our team will reach out"
          : "Deposit request submitted",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to submit deposit request");
    } finally {
      setLoading(false);
    }
  }

  function copyAddress() {
    if (!selectedMethod?.walletAddress) return;
    navigator.clipboard.writeText(selectedMethod.walletAddress);
    toast.success("Wallet address copied");
  }

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
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 12, 0],
                  }}
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
                    <ArrowDownToLine className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                      Add Funds
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold mt-0.5">
                      Deposit
                    </h1>
                    <p className="text-indigo-50/90 text-sm mt-1">
                      Fund your account in seconds with a digital asset transfer.
                    </p>
                  </div>
                </div>

                <div className="relative grid grid-cols-3 gap-2 mt-5">
                  {[
                    { icon: Shield, label: "Secured", value: "Cold storage" },
                    { icon: Clock, label: "Confirms", value: "~10 mins" },
                    {
                      icon: Wallet,
                      label: "Network fee",
                      value: "Network only",
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
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
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-4 text-2xl font-bold tabular-nums outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map((q, i) => (
                      <motion.button
                        key={q}
                        type="button"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setAmount(String(q))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                          amount === String(q)
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                        }`}
                      >
                        ${q.toLocaleString()}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Asset selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Bank transfer option */}
                    <motion.button
                      key="BANK"
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCryptoType("BANK")}
                      className={`relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                        cryptoType === "BANK"
                          ? "ring-2 ring-indigo-500 border-transparent bg-gradient-to-br from-indigo-50 to-blue-50"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-indigo-600 to-blue-600">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Bank
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Wire transfer
                          </p>
                        </div>
                      </div>
                      {cryptoType === "BANK" && (
                        <motion.div
                          layoutId="asset-check"
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Crypto options */}
                    {(Object.keys(paymentMethods) as AssetKey[]).map((key, i) => {
                      const m = paymentMethods[key];
                      const selected = cryptoType === key;
                      return (
                        <motion.button
                          key={key}
                          type="button"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.36 + i * 0.06 }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setCryptoType(key)}
                          className={`relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                            selected
                              ? "ring-2 ring-indigo-500 border-transparent bg-gradient-to-br from-indigo-50 to-blue-50"
                              : "border-slate-200 bg-white hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ background: m.color }}
                            >
                              <Bitcoin className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {key}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {m.label}
                              </p>
                            </div>
                          </div>
                          {selected && (
                            <motion.div
                              layoutId="asset-check"
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Bank transfer contact card */}
                <AnimatePresence>
                  {cryptoType === "BANK" && (
                    <motion.div
                      key="bank-card"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5">
                        <motion.div
                          animate={{ x: ["-10%", "110%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none"
                        />

                        <div className="relative flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                              Bank transfer
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">
                              Contact us to receive wire details
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow bg-gradient-to-r from-indigo-600 to-blue-600">
                            <Building2 className="w-3 h-3" />
                            Bank
                          </span>
                        </div>

                        <p className="relative text-sm text-slate-700 leading-relaxed mb-4">
                          For your security, our team shares wire instructions
                          directly. Reach out via email or WhatsApp and we'll
                          send the bank details and confirm the transfer.
                        </p>

                        <div className="relative grid sm:grid-cols-2 gap-2.5">
                          <a
                            href={`mailto:${SUPPORT_EMAIL}?subject=Bank%20Transfer%20Deposit${
                              amount
                                ? `%20%E2%80%94%20%24${encodeURIComponent(amount)}`
                                : ""
                            }`}
                            className="group flex items-start gap-3 rounded-xl border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-md px-3.5 py-3 transition"
                          >
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Email support
                              </p>
                              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                                {SUPPORT_EMAIL}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>

                          <a
                            href={SUPPORT_WHATSAPP_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-start gap-3 rounded-xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md px-3.5 py-3 transition"
                          >
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                              <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                WhatsApp
                              </p>
                              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                {SUPPORT_WHATSAPP}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        <p className="relative text-xs text-slate-500 mt-3 leading-relaxed">
                          Submitting this form notifies our team. You'll
                          receive the bank details and reference within
                          minutes during business hours.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wallet address */}
                <AnimatePresence>
                  {selectedMethod && (
                    <motion.div
                      key={cryptoType}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5">
                        <motion.div
                          animate={{ x: ["-10%", "110%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none"
                        />

                        <div className="relative flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                              Send to address
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">
                              {selectedMethod.network}
                            </p>
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow"
                            style={{ background: selectedMethod.color }}
                          >
                            {cryptoType}
                          </span>
                        </div>

                        <div className="relative rounded-xl bg-white border border-indigo-100 p-3.5 break-all text-sm font-mono text-slate-800 leading-relaxed">
                          {selectedMethod.walletAddress}
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={copyAddress}
                          className="relative mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 hover:shadow-md transition"
                        >
                          <Copy className="w-4 h-4" />
                          Copy address
                        </motion.button>

                        <p className="relative text-xs text-slate-500 mt-3 leading-relaxed">
                          Only send {cryptoType} via the{" "}
                          {selectedMethod.network}. Sending other assets or
                          using the wrong network may result in permanent loss.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
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
                    ) : cryptoType === "BANK" ? (
                      <>
                        <Building2 className="w-4 h-4" />
                        Notify support team
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" />
                        Submit deposit request
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
              {cryptoType === "BANK" ? (
                <>
                  <p className="relative text-slate-600 mt-3 max-w-xl mx-auto">
                    Our team will reach out shortly with bank transfer details.
                    For the fastest reply, contact us directly:
                  </p>
                  <div className="relative grid sm:grid-cols-2 gap-2.5 mt-5 max-w-xl mx-auto text-left">
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="group flex items-center gap-3 rounded-xl border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-md px-3.5 py-3 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {SUPPORT_EMAIL}
                        </p>
                      </div>
                    </a>
                    <a
                      href={SUPPORT_WHATSAPP_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md px-3.5 py-3 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          WhatsApp
                        </p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {SUPPORT_WHATSAPP}
                        </p>
                      </div>
                    </a>
                  </div>
                </>
              ) : (
                <p className="relative text-slate-600 mt-3 max-w-xl mx-auto">
                  Your deposit request has been recorded. Complete the transfer
                  to the displayed wallet address — your balance will update once
                  the network confirms.
                </p>
              )}
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
