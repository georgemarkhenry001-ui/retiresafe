import { motion } from "motion/react";
import {
  Shield,
  Gauge,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
  {
    name: "Conservative",
    tagline: "Capital preservation focus",
    returnsRange: "20% – 26%",
    returnsPeak: 26,
    minInvestment: "$500",
    description:
      "Our most conservative strategy — stable, low-volatility positions designed to preserve your capital while comfortably outpacing inflation.",
    icon: Shield,
    accent: "from-sky-500 to-blue-600",
    accentSoft: "from-sky-50 to-blue-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    features: [
      "Capital preservation focus",
      "Stablecoin & blue-chip mix",
      "Monthly performance reports",
      "24/7 support access",
    ],
  },
  {
    name: "Balanced",
    tagline: "Steady, diversified growth",
    returnsRange: "28% – 32%",
    returnsPeak: 32,
    minInvestment: "$10,000",
    description:
      "A balanced approach that pairs safety with meaningful growth. Ideal for retirees seeking a dependable income stream and gentle compounding.",
    icon: Gauge,
    accent: "from-indigo-500 to-blue-600",
    accentSoft: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    popular: true,
    features: [
      "Optimized risk-reward ratio",
      "Diversified asset allocation",
      "Quarterly advisor calls",
      "Automated rebalancing",
    ],
  },
  {
    name: "Growth",
    tagline: "Higher upside potential",
    returnsRange: "34% – 46%",
    returnsPeak: 46,
    minInvestment: "$50,000",
    description:
      "Designed for those with a longer horizon who want to maximize their nest egg with carefully managed exposure to higher-growth opportunities.",
    icon: Flame,
    accent: "from-violet-500 to-indigo-600",
    accentSoft: "from-violet-50 to-indigo-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    features: [
      "Maximum growth potential",
      "Dynamic market exposure",
      "Dedicated account manager",
      "Custom tax-loss harvesting",
    ],
  },
];

interface InvestmentPlansProps {
  onGetStartedClick: () => void;
}

export default function InvestmentPlans({
  onGetStartedClick,
}: InvestmentPlansProps) {
  return (
    <section
      id="plans"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Animated background motion graphics */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Investment Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Pick a path,{" "}
            <span className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              we handle the rest
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Three professionally managed strategies — choose the one that
            matches your risk profile and let us do the heavy lifting.
          </p>
        </motion.div>

        {/* Reserve space at top so the popular badge has guaranteed room on every breakpoint */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={cn(
                  "relative group rounded-[32px] flex flex-col",
                  plan.popular ? "z-10" : "",
                )}
              >
                {/* Most Popular badge — sits OUTSIDE the card with overflow:hidden so it never gets clipped */}
                {plan.popular && (
                  <motion.div
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.45 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  >
                    <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] shadow-lg shadow-indigo-500/40 ring-2 ring-white whitespace-nowrap">
                      <Crown className="w-3 h-3" />
                      Most Popular
                    </div>
                  </motion.div>
                )}

                {/* Animated gradient border for popular */}
                {plan.popular && (
                  <motion.div
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-[32px] bg-[linear-gradient(120deg,#6366f1,#3b82f6,#8b5cf6,#6366f1)] bg-[length:300%_300%] opacity-90 pointer-events-none"
                    style={{
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "2px",
                    }}
                  />
                )}

                <div
                  className={cn(
                    "relative h-full overflow-hidden bg-white rounded-[32px] p-7 sm:p-8 flex flex-col",
                    plan.popular
                      ? "shadow-2xl shadow-indigo-500/15"
                      : "border border-slate-200 shadow-sm hover:shadow-xl transition-shadow",
                  )}
                >
                  {/* Soft accent glow inside card */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.18, 0.32, 0.18],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    className={cn(
                      "absolute -top-24 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none",
                      `bg-gradient-to-br ${plan.accentSoft}`,
                    )}
                  />

                  {/* Header: icon + name */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: -6, scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }}
                      className={cn(
                        "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg",
                        `bg-gradient-to-br ${plan.accent}`,
                      )}
                      style={{
                        boxShadow: `0 12px 28px rgba(99,102,241,0.25)`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white relative z-10" />
                      <motion.span
                        animate={{
                          opacity: [0.4, 0.8, 0.4],
                          scale: [1, 1.12, 1],
                        }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                        className={cn(
                          "absolute inset-0 rounded-2xl blur-md",
                          `bg-gradient-to-br ${plan.accent} opacity-50`,
                        )}
                      />
                    </motion.div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {plan.tagline}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Returns headline */}
                  <div className="relative mt-5 mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={cn(
                          "text-4xl font-bold tabular-nums bg-gradient-to-br bg-clip-text text-transparent",
                          plan.accent,
                        )}
                      >
                        {plan.returnsRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Annual return range
                    </p>

                    {/* Visual return bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.min(100, plan.returnsPeak * 2)}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.1,
                          delay: 0.3 + i * 0.08,
                          ease: "easeOut",
                        }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          plan.accent,
                        )}
                      />
                    </div>
                  </div>

                  {/* Min investment chip */}
                  <div className="relative inline-flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Min. investment
                    </span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">
                      {plan.minInvestment}
                    </span>
                  </div>

                  <p className="relative text-slate-600 text-sm leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <ul className="relative space-y-3 mb-7 flex-1">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + j * 0.06 }}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <span
                          className={cn(
                            "mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0",
                            plan.accent,
                          )}
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onGetStartedClick}
                    className={cn(
                      "relative overflow-hidden w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all",
                      plan.popular
                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
                    )}
                  >
                    {plan.popular && (
                      <motion.span
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                      />
                    )}
                    <span className="relative inline-flex items-center gap-2">
                      Get started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500"
        >
          {[
            "Cold-storage custody",
            "$250M insurance coverage",
            "Manual withdrawal review",
            "No lock-in periods",
          ].map((t) => (
            <div key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
