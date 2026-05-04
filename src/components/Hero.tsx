import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Lock,
  Wallet,
} from "lucide-react";

function useCounter(target: number, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function MiniSparkline() {
  // A simple animated SVG line + filled area that draws on mount
  const points = [12, 18, 14, 22, 26, 20, 28, 32, 30, 38, 42, 48, 46, 54, 60];
  const w = 200;
  const h = 60;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const stepX = w / (points.length - 1);

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * stepX} ${
          h - ((p - min) / (max - min)) * (h - 6) - 3
        }`,
    )
    .join(" ");

  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <defs>
        <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill="url(#hero-spark-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#4f46e5"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
      />
      <motion.circle
        cx={w}
        cy={h - ((points[points.length - 1] - min) / (max - min)) * (h - 6) - 3}
        r={3.5}
        fill="#4f46e5"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.7 }}
      />
    </svg>
  );
}

function FloatingCoin({
  symbol,
  color,
  className,
  delay = 0,
  size = "md",
}: {
  symbol: string;
  color: string;
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg"
      ? "w-16 h-16 text-base"
      : size === "sm"
      ? "w-10 h-10 text-xs"
      : "w-12 h-12 text-sm";
  return (
    <motion.div
      animate={{
        y: [0, -16, 0],
        rotate: [0, 8, -4, 0],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`hidden md:flex absolute ${className} ${dim} rounded-full items-center justify-center text-white font-bold shadow-xl ring-4 ring-white/40`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 12px 28px ${color}40`,
      }}
    >
      {symbol}
    </motion.div>
  );
}

export default function Hero({
  onContactClick,
}: {
  onContactClick: () => void;
}) {
  const trusted = useCounter(2500);
  const aum = useCounter(180);
  const yearsAvg = useCounter(13);

  return (
    <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-[-15%] right-[-10%] w-[560px] h-[560px] bg-indigo-200/50 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.65, 0.5] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="hidden md:block absolute bottom-[5%] left-[-8%] w-[460px] h-[460px] bg-blue-200/50 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="hidden md:block absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-100/40 rounded-full blur-3xl"
        />
        <div
          className="hidden md:block absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.18) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 35%, transparent 80%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
            >
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Trusted by 2,500+ Retirees
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.05] mb-6 tracking-tight">
              Secure Your Retirement with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Steady
                </span>
                <motion.span
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                  className="absolute left-0 right-0 bottom-1 h-2 bg-indigo-200/70 -z-0 rounded-full"
                />
              </span>{" "}
              Digital Wealth.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 lg:mb-10 leading-relaxed max-w-xl">
              Conservative digital wealth strategies designed for dependable
              returns while protecting what you've built. We manage the
              complexity, you enjoy the peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContactClick}
                className="relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-300/50 flex items-center justify-center gap-2 group"
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
                <span className="relative inline-flex items-center gap-2">
                  Start Your Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <a
                href="#calculator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-slate-700 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all text-center"
              >
                Calculate Returns
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                "Fully Managed Portfolios",
                "Low-Risk Diversification",
                "No Technical Knowledge Needed",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Inline stat strip */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
              {[
                {
                  label: "Retirees served",
                  value: `${Math.round(trusted).toLocaleString()}+`,
                  icon: Shield,
                },
                {
                  label: "Assets managed",
                  value: `$${aum.toFixed(0)}M+`,
                  icon: Wallet,
                },
                {
                  label: "Avg. yearly",
                  value: `${yearsAvg.toFixed(1)}%`,
                  icon: TrendingUp,
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white/60 backdrop-blur px-3 py-2.5"
                >
                  <s.icon className="w-3.5 h-3.5 text-indigo-500" />
                  <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-0.5">
                    {s.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=900"
                alt="Happy retiree couple"
                className="w-full h-auto"
                width={900}
                height={600}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 via-indigo-900/10 to-transparent" />

              {/* Live tag */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100 shadow"
              >
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Markets Live
              </motion.div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-3 sm:-bottom-6 sm:-left-6 z-20 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 w-[220px] sm:w-[260px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Avg. Quarterly Return
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    13<span className="text-indigo-600">%</span>
                  </div>
                </div>
              </div>
              <MiniSparkline />
              <p className="text-[10px] text-slate-400 leading-tight mt-2">
                *Based on our 2024 Conservative Growth Portfolio.
              </p>
            </motion.div>

            {/* Floating security card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="hidden md:flex absolute -top-4 -right-4 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Insured
                </p>
                <p className="text-sm font-bold text-slate-900">
                  $250M coverage
                </p>
              </div>
            </motion.div>

            {/* Floating crypto coins */}
            <FloatingCoin
              symbol="₿"
              color="#f7931a"
              className="-top-6 left-1/2"
              delay={0}
              size="md"
            />
            <FloatingCoin
              symbol="Ξ"
              color="#627eea"
              className="bottom-1/3 -right-6"
              delay={0.8}
              size="sm"
            />
            <FloatingCoin
              symbol="◎"
              color="#9945ff"
              className="top-1/3 -left-8"
              delay={1.4}
              size="sm"
            />

            {/* Floating sparkle */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 14, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="hidden md:block absolute top-12 right-1/3 text-indigo-400"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
