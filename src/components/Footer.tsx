import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e: any) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email");
      return;
    }
    setJoined(true);
    toast.success("You're on the list");
  }

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Animated gradient mesh */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="hidden md:block absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-blue-500/25 blur-3xl pointer-events-none"
      />
      <div
        className="hidden md:block absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Top scanning line */}
      <motion.div
        animate={{ x: ["-10%", "110%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 lg:py-20">
        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 shadow-2xl shadow-indigo-500/20"
        >
          <motion.div
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
          />
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 12, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-6 right-8 text-white/40"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free Consultation
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to grow your nest egg?
              </h3>
              <p className="text-indigo-100/90 text-sm sm:text-base mt-2">
                Speak with a retirement specialist — no pressure, no obligation,
                just clarity on what's possible.
              </p>
            </div>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="mailto:main@retiresafecrypto.com"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition shrink-0"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div
                whileHover={{ rotate: -6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <Shield className="text-white w-5 h-5 relative z-10" />
                <motion.span
                  animate={{
                    opacity: [0.4, 0.9, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/40 to-blue-400/40 blur-md"
                />
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-white">
                RetireSafe
                <span className="bg-gradient-to-br from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  Crypto
                </span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              Empowering retirees to preserve and grow wealth through secure,
              professionally managed digital asset portfolios.
            </p>
            <div className="flex items-center gap-2">
              {[
                { label: "Insured", value: "$250M" },
                { label: "Clients", value: "2,500+" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
                >
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    {b.label}
                  </p>
                  <p className="text-sm font-bold text-white tabular-nums">
                    {b.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "#approach", label: "Our Approach" },
                { href: "#calculator", label: "Calculator" },
                { href: "#faq", label: "FAQ" },
                { href: "#", label: "Privacy" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-indigo-400 transition-all" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:main@retiresafecrypto.com"
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-indigo-400/30 transition px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Email
                    </p>
                    <p className="text-slate-200 group-hover:text-white truncate">
                      main@retiresafecrypto.com
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/14176041178"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-emerald-400/30 transition px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                    <FaWhatsapp size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      WhatsApp
                    </p>
                    <p className="text-slate-200 group-hover:text-white">
                      +1 417 604 1178
                    </p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-400/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Office
                  </p>
                  <p className="text-slate-200 leading-snug">
                    7788 Orbit Industrial Way
                    <br />
                    Aetherfield, IL 60666
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Monthly "Secure Growth" insights, delivered straight to your
              inbox.
            </p>
            {!joined ? (
              <form onSubmit={handleJoin} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition"
                  />
                </div>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30"
                >
                  <motion.span
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  />
                  <span className="relative inline-flex items-center gap-2">
                    Join the list
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
                <p className="text-[10px] text-slate-500">
                  Unsubscribe anytime. No spam.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-sm font-semibold text-emerald-200">
                  You're on the list — see you soon.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 RetireSafe Digital. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition">
              Terms
            </a>
            <span className="w-px h-3 bg-slate-700" />
            <a href="#" className="hover:text-slate-300 transition">
              Privacy
            </a>
            <span className="w-px h-3 bg-slate-700" />
            <a href="#" className="hover:text-slate-300 transition">
              Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
