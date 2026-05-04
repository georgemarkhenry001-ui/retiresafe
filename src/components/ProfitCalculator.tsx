import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calculator as CalcIcon,
  TrendingUp,
  Sparkles,
  Calendar,
  Wallet,
  ArrowRight,
  Shield,
  Flame,
  Gauge,
} from "lucide-react";
import { formatCurrency, cn } from "../lib/utils";

type RiskKey = "low" | "medium" | "high";
type ChartView = "annual" | "monthly";

const RISK_PROFILES: Record<
  RiskKey,
  {
    rate: number;
    label: string;
    range: string;
    desc: string;
    accent: string;
    icon: typeof Shield;
  }
> = {
  low: {
    rate: 0.23,
    label: "Conservative",
    range: "20 – 26%",
    desc: "Capital preservation focus",
    accent: "from-sky-500 to-blue-600",
    icon: Shield,
  },
  medium: {
    rate: 0.3,
    label: "Balanced",
    range: "28 – 32%",
    desc: "Steady, diversified growth",
    accent: "from-indigo-500 to-blue-600",
    icon: Gauge,
  },
  high: {
    rate: 0.4,
    label: "Growth",
    range: "34 – 46%",
    desc: "Higher upside potential",
    accent: "from-violet-500 to-indigo-600",
    icon: Flame,
  },
};

function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let frame = 0;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

const QUICK_AMOUNTS = [5000, 25000, 100000, 500000];
const QUICK_DURATIONS = [12, 24, 60, 120];

export default function ProfitCalculator() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(24);
  const [risk, setRisk] = useState<RiskKey>("medium");
  const [view, setView] = useState<ChartView>("annual");

  const rate = RISK_PROFILES[risk].rate;
  const monthlyRate = Math.pow(1 + rate, 1 / 12) - 1;

  const annualData = useMemo(() => {
    const totalYears = Math.max(1, Math.ceil(months / 12));
    const arr: { label: string; balance: number }[] = [];
    for (let i = 0; i <= totalYears; i++) {
      arr.push({
        label: i === 0 ? "Start" : `Y${i}`,
        balance: Math.round(amount * Math.pow(1 + rate, i)),
      });
    }
    return arr;
  }, [amount, months, rate]);

  const monthlyData = useMemo(() => {
    const arr: { label: string; balance: number }[] = [];
    for (let i = 0; i <= months; i++) {
      const showLabel =
        i === 0 ||
        i === months ||
        i % Math.max(1, Math.round(months / 8)) === 0;
      arr.push({
        label: showLabel ? (i === 0 ? "Start" : `M${i}`) : "",
        balance: Math.round(amount * Math.pow(1 + monthlyRate, i)),
      });
    }
    return arr;
  }, [amount, months, monthlyRate]);

  const data = view === "annual" ? annualData : monthlyData;

  const finalBalance = useMemo(
    () => Math.round(amount * Math.pow(1 + monthlyRate, months)),
    [amount, monthlyRate, months],
  );
  const totalProfit = finalBalance - amount;
  const roi = amount > 0 ? (totalProfit / amount) * 100 : 0;
  const monthlyIncome =
    months > 0 ? Math.round(totalProfit / months) : 0;
  const dailyIncome = months > 0 ? Math.round(totalProfit / (months * 30.4)) : 0;
  const doublingYears = rate > 0 ? 72 / (rate * 100) : 0;

  const animatedFinal = useAnimatedNumber(finalBalance);
  const animatedProfit = useAnimatedNumber(totalProfit);
  const animatedRoi = useAnimatedNumber(roi);
  const animatedMonthly = useAnimatedNumber(monthlyIncome);

  function handleAmountInput(raw: string) {
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (!isFinite(n)) return;
    setAmount(Math.max(500, Math.min(1_000_000, Math.round(n))));
  }

  return (
    <section
      id="calculator"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
    >
      {/* Animated background motion graphics */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="hidden md:block absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <CalcIcon className="w-3.5 h-3.5" />
            Retirement Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            See your future,{" "}
            <span className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              in numbers
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Adjust the inputs below — everything updates instantly so you can
            visualize what a steady, conservative strategy could mean for your
            retirement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative bg-white rounded-3xl sm:rounded-[40px] p-5 sm:p-6 md:p-10 border border-slate-200 shadow-xl shadow-indigo-500/5"
        >
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* ===== Inputs ===== */}
            <div className="lg:col-span-5 space-y-7">
              {/* Initial Investment */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Wallet className="w-3.5 h-3.5 text-indigo-500" />
                    Initial Investment
                  </label>
                </div>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount.toLocaleString()}
                    onChange={(e: any) => handleAmountInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3.5 text-2xl font-bold tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
                  />
                </div>
                <input
                  type="range"
                  min="500"
                  max="1000000"
                  step="500"
                  value={amount}
                  onChange={(e: any) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {QUICK_AMOUNTS.map((q) => (
                    <motion.button
                      key={q}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAmount(q)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold border transition",
                        amount === q
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700",
                      )}
                    >
                      ${q >= 1000 ? `${q / 1000}k` : q}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Duration
                  </label>
                  <span className="text-sm font-bold text-indigo-600 tabular-nums">
                    {months} months ·{" "}
                    {(Math.round((months / 12) * 10) / 10).toFixed(1)} years
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={months}
                  onChange={(e: any) => setMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {QUICK_DURATIONS.map((q) => (
                    <motion.button
                      key={q}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMonths(q)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold border transition",
                        months === q
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700",
                      )}
                    >
                      {q < 12 ? `${q}m` : `${q / 12}y`}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Risk Profile
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(Object.keys(RISK_PROFILES) as RiskKey[]).map((key) => {
                    const r = RISK_PROFILES[key];
                    const Icon = r.icon;
                    const selected = risk === key;
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRisk(key)}
                        className={cn(
                          "relative overflow-hidden p-3.5 rounded-2xl border-2 transition-all text-left",
                          selected
                            ? "border-indigo-600 shadow-md shadow-indigo-500/10"
                            : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        {selected && (
                          <motion.div
                            layoutId="risk-bg"
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br opacity-[0.08]",
                              r.accent,
                            )}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 28,
                            }}
                          />
                        )}
                        <div className="relative">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                              selected
                                ? `bg-gradient-to-br ${r.accent} text-white shadow`
                                : "bg-slate-100 text-slate-500",
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <p
                            className={cn(
                              "text-xs font-bold uppercase tracking-wider",
                              selected ? "text-indigo-700" : "text-slate-500",
                            )}
                          >
                            {r.label}
                          </p>
                          <p
                            className={cn(
                              "text-base font-bold mt-0.5 tabular-nums",
                              selected ? "text-slate-900" : "text-slate-700",
                            )}
                          >
                            {r.range}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                            {r.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Quick insight chip */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${risk}-${doublingYears.toFixed(1)}`}
                className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-slate-700 leading-snug">
                  At <span className="font-bold">{(rate * 100).toFixed(1)}%</span>{" "}
                  yearly, your money doubles in roughly{" "}
                  <span className="font-bold text-indigo-700">
                    {doublingYears.toFixed(1)} years
                  </span>
                  .
                </p>
              </motion.div>
            </div>

            {/* ===== Results ===== */}
            <div className="lg:col-span-7 space-y-5">
              {/* Hero result card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-7 text-white shadow-xl shadow-indigo-500/20"
              >
                <motion.div
                  animate={{ x: ["-10%", "110%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/20 blur-3xl pointer-events-none"
                />

                <div className="relative flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                      Projected Balance
                    </p>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums mt-1 break-words">
                      {formatCurrency(animatedFinal)}
                    </h3>
                    <p className="text-indigo-100/80 text-sm mt-1">
                      after {months} months at{" "}
                      {(rate * 100).toFixed(1)}% yearly
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 px-3 py-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tabular-nums">
                      +{animatedRoi.toFixed(1)}% ROI
                    </span>
                  </div>
                </div>

                <div className="relative grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 mt-5">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-3 py-2.5 min-w-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                      Total profit
                    </p>
                    <p className="text-base sm:text-lg font-bold tabular-nums mt-0.5 truncate">
                      +{formatCurrency(animatedProfit)}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-3 py-2.5 min-w-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                      Per month
                    </p>
                    <p className="text-base sm:text-lg font-bold tabular-nums mt-0.5 truncate">
                      {formatCurrency(animatedMonthly)}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-3 py-2.5 min-w-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                      Per day
                    </p>
                    <p className="text-base sm:text-lg font-bold tabular-nums mt-0.5 truncate">
                      {formatCurrency(dailyIncome)}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Chart card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Growth Trajectory
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {view === "annual"
                        ? "Year-over-year balance"
                        : "Month-over-month balance"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                    {(["annual", "monthly"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={cn(
                          "relative px-3 py-1.5 text-xs font-bold rounded-lg transition capitalize",
                          view === v
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-700",
                        )}
                      >
                        {view === v && (
                          <motion.span
                            layoutId="chart-pill"
                            className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 28,
                            }}
                          />
                        )}
                        <span className="relative">{v}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={view}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient
                              id="calc-fill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4f46e5"
                                stopOpacity={0.32}
                              />
                              <stop
                                offset="100%"
                                stopColor="#4f46e5"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                            <linearGradient
                              id="calc-stroke"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#4f46e5" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            dy={6}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            tickFormatter={(value) =>
                              value >= 1000
                                ? `$${(value / 1000).toFixed(0)}k`
                                : `$${value}`
                            }
                            width={48}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "14px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10)",
                            }}
                            formatter={(value: number) => [
                              formatCurrency(value),
                              "Balance",
                            ]}
                            cursor={{
                              stroke: "#a5b4fc",
                              strokeWidth: 1,
                              strokeDasharray: "4 4",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="url(#calc-stroke)"
                            strokeWidth={2.75}
                            fill="url(#calc-fill)"
                            isAnimationActive
                            animationDuration={900}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA */}
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#"
                className="group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-4 transition"
              >
                <motion.span
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent pointer-events-none"
                />
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Like what you see?
                    </p>
                    <p className="text-base font-bold">
                      Talk to a retirement specialist
                    </p>
                  </div>
                </div>
                <span className="relative text-sm font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                  Free consultation →
                </span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
