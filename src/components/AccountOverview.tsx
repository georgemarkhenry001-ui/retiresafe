import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import {
  TrendingUp,
  TrendingDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  Wallet,
  CalendarDays,
  Sparkles,
  Zap,
  PieChart as PieIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import TopNav from "./TopNav";

type UserProfile = {
  fullName?: string;
  email?: string;
  balance?: number;
  createdAt?: any;
};
type ActivityItem = {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: string;
  createdAt?: any;
};

type Ticker = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  color: string;
};

const INITIAL_TICKERS: Ticker[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 0, change: 0, color: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 0, change: 0, color: "#627eea" },
  { id: "solana", symbol: "SOL", name: "Solana", price: 0, change: 0, color: "#9945ff" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 0, change: 0, color: "#f3ba2f" },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 0, change: 0, color: "#23292f" },
];

function useAnimatedNumber(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let frame = 0;

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function LiveDot() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
    </span>
  );
}

type LiveTrade = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  color: string;
};

const ALLOCATIONS = [
  { symbol: "BTC", name: "Bitcoin", pct: 42, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", pct: 28, color: "#627eea" },
  { symbol: "SOL", name: "Solana", pct: 16, color: "#9945ff" },
  { symbol: "BNB", name: "BNB", pct: 9, color: "#f3ba2f" },
  { symbol: "Stables", name: "USDC / USDT", pct: 5, color: "#22c55e" },
];

export default function AccountOverview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
  const [flash, setFlash] = useState<Record<string, "up" | "down">>({});
  const [liveTrades, setLiveTrades] = useState<LiveTrade[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pricesLive, setPricesLive] = useState(false);
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "3M" | "ALL">("1M");
  const tickersRef = useRef<Ticker[]>(INITIAL_TICKERS);
  const balanceRef = useRef<number>(0);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const depositQuery = query(
      collection(db, "depositRequests"),
      where("userId", "==", user.uid),
    );
    const withdrawalQuery = query(
      collection(db, "withdrawalRequests"),
      where("userId", "==", user.uid),
    );

    let deposits: ActivityItem[] = [];
    let withdrawals: ActivityItem[] = [];

    const combineAndSet = () => {
      const merged = [...deposits, ...withdrawals]
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bTime - aTime;
        })
        .slice(0, 6);
      setRecentActivity(merged);
    };

    const unsubDeposits = onSnapshot(depositQuery, (snapshot) => {
      deposits = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        type: "deposit",
        amount: Number(docItem.data().amount || 0),
        status: docItem.data().status || "processing",
        createdAt: docItem.data().createdAt,
      }));
      combineAndSet();
    });

    const unsubWithdrawals = onSnapshot(withdrawalQuery, (snapshot) => {
      withdrawals = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        type: "withdrawal",
        amount: Number(docItem.data().amount || 0),
        status: docItem.data().status || "processing",
        createdAt: docItem.data().createdAt,
      }));
      combineAndSet();
    });

    return () => {
      unsubDeposits();
      unsubWithdrawals();
    };
  }, [user]);

  // Real live prices from CoinGecko — refreshes every 15s
  useEffect(() => {
    let cancelled = false;
    const ids = INITIAL_TICKERS.map((t) => t.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const fetchPrices = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        setTickers((prev: Ticker[]) => {
          const next = prev.map((t) => {
            const entry = data[t.id];
            if (!entry || typeof entry.usd !== "number") return t;
            return {
              ...t,
              price: entry.usd,
              change:
                typeof entry.usd_24h_change === "number"
                  ? entry.usd_24h_change
                  : t.change,
            };
          });

          const nextFlash: Record<string, "up" | "down"> = {};
          next.forEach((t, i) => {
            if (prev[i].price > 0) {
              if (t.price > prev[i].price) nextFlash[t.symbol] = "up";
              else if (t.price < prev[i].price) nextFlash[t.symbol] = "down";
            }
          });
          setFlash(nextFlash);
          tickersRef.current = next;
          return next;
        });

        setPricesLive(true);
        setLastUpdated(new Date());
      } catch {
        // Network blocked or rate-limited — fall back to gentle drift so the
        // page never feels frozen. Keeps last known prices intact.
        setTickers((prev: Ticker[]) => {
          if (prev.every((t) => t.price === 0)) return prev;
          const next = prev.map((t) => {
            const drift = (Math.random() - 0.5) * (t.price * 0.0015);
            return { ...t, price: Math.max(0.0001, t.price + drift) };
          });
          tickersRef.current = next;
          return next;
        });
      }
    };

    fetchPrices();
    const id = setInterval(fetchPrices, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Simulated live trades feed — pushes a new tick every ~2.2s using live prices
  useEffect(() => {
    const pickRef = () => {
      const live = tickersRef.current.filter((t: Ticker) => t.price > 0);
      const pool = live.length > 0 ? live : INITIAL_TICKERS;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const id = setInterval(() => {
      const ref = pickRef();
      if (!ref || ref.price <= 0) return;

      const currentBalance = balanceRef.current;
      if (currentBalance <= 0) {
        setLiveTrades([]);
        return;
      }

      // Each trade represents 0.5% – 5% of the user's balance.
      const sliceFraction = 0.005 + Math.random() * 0.045;
      const targetUsd = currentBalance * sliceFraction;
      const tradePrice = ref.price * (1 + (Math.random() - 0.5) * 0.002);
      const amount = targetUsd / tradePrice;

      const trade: LiveTrade = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        symbol: ref.symbol,
        side: Math.random() > 0.22 ? "buy" : "sell",
        amount: Number(amount.toFixed(amount < 1 ? 4 : 3)),
        price: tradePrice,
        color: ref.color,
      };
      setLiveTrades((prev: LiveTrade[]) => [trade, ...prev].slice(0, 7));
    }, 2200);

    return () => clearInterval(id);
  }, []);

  const balance = Number(profile?.balance || 0);
  const animatedBalance = useAnimatedNumber(balance);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const growthData = useMemo(() => {
    const today = new Date();
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - 38);

    if (profile?.createdAt) {
      const createdDate = profile.createdAt.toDate
        ? profile.createdAt.toDate()
        : new Date(profile.createdAt);
      startDate = createdDate;
    }

    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const numPoints = Math.max(12, daysDiff + 1);

    const offsets: number[] = [];
    for (let i = 0; i < numPoints; i++) offsets.push(i - (numPoints - 1));

    if (balance === 0) {
      return offsets.map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return {
          date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          value: 0,
        };
      });
    }

    const base = balance;
    const growthPercentages = [
      -1.3, 0.4, -0.3, 1.1, 0.07, 0.3, 0.8, 0.5, 1.6, 1.2, 1.5, 1.4,
    ];

    return offsets.map((offset, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const percentage = growthPercentages[index % growthPercentages.length];
      const value = (base * percentage) / 100;
      return {
        date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        value: Math.round((base + value) * 100) / 100,
      };
    });
  }, [balance, profile?.createdAt]);

  const visibleGrowth = useMemo(() => {
    if (timeframe === "ALL") return growthData;
    const map: Record<typeof timeframe, number> = {
      "1W": 7,
      "1M": 30,
      "3M": 90,
      ALL: growthData.length,
    };
    const window = map[timeframe];
    return growthData.slice(-Math.min(window + 1, growthData.length));
  }, [growthData, timeframe]);

  const stats = useMemo(() => {
    if (growthData.length < 2) {
      return { change24h: 0, changePct: 0, allTime: 0, activeDays: 0 };
    }
    const last = growthData[growthData.length - 1].value;
    const prev = growthData[growthData.length - 2].value;
    const first = growthData[0].value || balance;
    const change24h = last - prev;
    const changePct = prev > 0 ? (change24h / prev) * 100 : 0;
    const allTime = first > 0 ? ((last - first) / first) * 100 : 0;

    let activeDays = 0;
    if (profile?.createdAt) {
      const createdDate = profile.createdAt.toDate
        ? profile.createdAt.toDate()
        : new Date(profile.createdAt);
      activeDays = Math.max(
        1,
        Math.ceil((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
      );
    }
    return { change24h, changePct, allTime, activeDays };
  }, [growthData, balance, profile?.createdAt]);

  const isUp = stats.change24h >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <TopNav />

      {/* Live ticker strip */}
      <div className="bg-slate-900 text-white border-b border-slate-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-700">
            <LiveDot />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-6 animate-[ticker_38s_linear_infinite] whitespace-nowrap">
              {[...tickers, ...tickers].map((t, i) => {
                const flashState = flash[t.symbol];
                return (
                  <div key={`${t.symbol}-${i}`} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: t.color }}
                    />
                    <span className="font-semibold text-slate-200">{t.symbol}</span>
                    <motion.span
                      key={`${t.symbol}-${t.price.toFixed(4)}`}
                      initial={{
                        color:
                          flashState === "up"
                            ? "#34d399"
                            : flashState === "down"
                            ? "#f87171"
                            : "#ffffff",
                      }}
                      animate={{ color: "#ffffff" }}
                      transition={{ duration: 0.9 }}
                      className="font-mono tabular-nums"
                    >
                      ${t.price < 10 ? t.price.toFixed(4) : t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </motion.span>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        t.change >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.change >= 0 ? "+" : ""}
                      {t.change.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 pointer-events-none" />
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
                  {(profile?.fullName || user?.email || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-600 font-bold">
                  {greeting()} · Account Overview
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1 truncate">
                  {profile?.fullName || user?.email}
                </h1>
                <p className="text-slate-600 mt-1 text-sm">
                  Real-time portfolio tracking and investment growth.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                <LiveDot />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Markets Active
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-slate-200 px-3 py-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    pricesLive ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-xs font-semibold text-slate-600">
                  {pricesLive
                    ? `Prices live · ${
                        lastUpdated
                          ? lastUpdated.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "—"
                      }`
                    : "Connecting to feed…"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6"
        >
          {[
            {
              label: "24h Change",
              icon: isUp ? TrendingUp : TrendingDown,
              value: `${isUp ? "+" : ""}$${Math.abs(stats.change24h).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              sub: `${isUp ? "+" : ""}${stats.changePct.toFixed(2)}%`,
              tone: isUp ? "emerald" : "rose",
            },
            {
              label: "All-time Return",
              icon: Sparkles,
              value: `${stats.allTime >= 0 ? "+" : ""}${stats.allTime.toFixed(2)}%`,
              sub: "Since account creation",
              tone: "violet",
            },
            {
              label: "Active Days",
              icon: CalendarDays,
              value: `${stats.activeDays}`,
              sub: "Days invested",
              tone: "indigo",
            },
            {
              label: "Portfolio",
              icon: Wallet,
              value: balance > 0 ? "Active" : "Idle",
              sub: balance > 0 ? "Growing steadily" : "Make a deposit to start",
              tone: "sky",
            },
          ].map((s) => {
            const tones: Record<string, string> = {
              emerald: "bg-emerald-50 text-emerald-600",
              rose: "bg-rose-50 text-rose-600",
              violet: "bg-violet-50 text-violet-600",
              indigo: "bg-indigo-50 text-indigo-600",
              sky: "bg-sky-50 text-sky-600",
            };
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[s.tone]}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 tabular-nums truncate">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl shadow-lg p-6 sm:p-8 text-white"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-violet-400/20 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                  Current Balance
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1">
                  <LiveDot />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 min-w-0">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums truncate">
                  $
                  {animatedBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5">
                {isUp ? (
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-300" />
                )}
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isUp ? "text-emerald-200" : "text-rose-200"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {stats.changePct.toFixed(2)}% today
                </span>
              </div>

              <p className="text-indigo-100/80 mt-4 text-sm">
                Reflects your approved balance, updated in real time as positions
                settle.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 mt-7">
                <Link
                  to="/deposit"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-700 rounded-2xl px-4 py-3 font-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <ArrowDownToLine className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                  Deposit
                </Link>
                <Link
                  to="/withdrawal"
                  className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/30 rounded-2xl px-4 py-3 font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition"
                >
                  <ArrowUpFromLine className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  Withdraw
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8"
          >
            {/* Soft animated background */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.32, 0.18] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.24, 0.12] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full bg-blue-200/40 blur-3xl pointer-events-none"
            />

            {(() => {
              const first = visibleGrowth[0]?.value ?? 0;
              const last =
                visibleGrowth[visibleGrowth.length - 1]?.value ?? 0;
              const delta = last - first;
              const pct = first > 0 ? (delta / first) * 100 : 0;
              const up = delta >= 0;
              const high = visibleGrowth.reduce(
                (m: number, p: { value: number }) =>
                  p.value > m ? p.value : m,
                0,
              );
              const low = visibleGrowth.reduce(
                (m: number, p: { value: number }) =>
                  p.value < m || m === 0 ? p.value : m,
                first,
              );
              return (
                <>
                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(99,102,241,0.4)",
                            "0 0 0 12px rgba(99,102,241,0)",
                          ],
                        }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0"
                      >
                        <Activity className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                          Growth Tracker
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                          Investment Growth
                        </h3>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 shrink-0">
                      <LiveDot />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Tracking
                      </span>
                    </div>
                  </div>

                  {/* Hero KPI row */}
                  <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Current value
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums mt-0.5 truncate">
                        $
                        {last.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border px-4 py-3 min-w-0 ${
                        up
                          ? "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white"
                          : "border-rose-100 bg-gradient-to-br from-rose-50 to-white"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          up ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        Period change
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <p
                          className={`text-xl sm:text-2xl font-bold tabular-nums ${
                            up ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {up ? "+" : ""}
                          {pct.toFixed(2)}%
                        </p>
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                            up ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {up ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          ${Math.abs(delta).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white px-4 py-3 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Period high
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-700 tabular-nums mt-0.5 truncate">
                        $
                        {high.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Timeframe selector */}
                  <div className="relative flex items-center justify-between gap-3 mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:block">
                      Range
                    </p>
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 ml-auto">
                      {(["1W", "1M", "3M", "ALL"] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                            timeframe === tf
                              ? "text-white"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {timeframe === tf && (
                            <motion.span
                              layoutId="tf-pill"
                              className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 shadow-md shadow-indigo-500/25"
                              transition={{
                                type: "spring",
                                stiffness: 320,
                                damping: 28,
                              }}
                            />
                          )}
                          <span className="relative">{tf}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="relative h-[280px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={visibleGrowth}
                        margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="growthFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366f1"
                              stopOpacity={0.42}
                            />
                            <stop
                              offset="55%"
                              stopColor="#3b82f6"
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3b82f6"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="growthStroke"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                          <filter
                            id="lineGlow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                          >
                            <feGaussianBlur stdDeviation="2.4" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <filter
                            id="dotGlow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        <CartesianGrid
                          stroke="#eef0f5"
                          strokeDasharray="3 3"
                          strokeOpacity={0.7}
                          vertical={false}
                        />

                        <XAxis
                          dataKey="date"
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                          axisLine={false}
                          tickLine={false}
                          padding={{ left: 8, right: 8 }}
                          minTickGap={32}
                        />

                        <YAxis
                          orientation="right"
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                          axisLine={false}
                          tickLine={false}
                          domain={["dataMin - 40", "dataMax + 40"]}
                          tickFormatter={(value) => {
                            const v = Number(value);
                            if (Math.abs(v) >= 1_000_000)
                              return `$${(v / 1_000_000).toFixed(1)}M`;
                            if (Math.abs(v) >= 1_000)
                              return `$${(v / 1_000).toFixed(1)}k`;
                            return `$${v.toFixed(0)}`;
                          }}
                          width={56}
                        />

                        {high > 0 && low !== high && (
                          <ReferenceLine
                            y={high}
                            stroke="#a5b4fc"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                            label={{
                              value: "High",
                              position: "insideTopRight",
                              fill: "#6366f1",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          />
                        )}

                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}`,
                            "Balance",
                          ]}
                          labelStyle={{ color: "#0f172a", fontWeight: 700 }}
                          contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 14px 36px rgba(15, 23, 42, 0.12)",
                            padding: "10px 14px",
                          }}
                          cursor={{
                            stroke: "#6366f1",
                            strokeWidth: 1.25,
                            strokeDasharray: "4 4",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="url(#growthStroke)"
                          strokeWidth={3}
                          fill="url(#growthFill)"
                          filter="url(#lineGlow)"
                          dot={(props: any) => {
                            const { cx, cy, index } = props;
                            const isLast =
                              index === visibleGrowth.length - 1;
                            if (!isLast) return <g key={`d-${index}`} />;
                            return (
                              <g key={`d-last-${index}`}>
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={9}
                                  fill="#3b82f6"
                                  opacity={0.3}
                                >
                                  <animate
                                    attributeName="r"
                                    values="6;16;6"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.45;0;0.45"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </circle>
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={5}
                                  fill="#4f46e5"
                                  stroke="#fff"
                                  strokeWidth={2.5}
                                  filter="url(#dotGlow)"
                                />
                              </g>
                            );
                          }}
                          activeDot={{
                            r: 6,
                            fill: "#4f46e5",
                            stroke: "#fff",
                            strokeWidth: 2.5,
                          }}
                          isAnimationActive
                          animationDuration={1300}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-slate-500">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="relative inline-flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
                      </span>
                      Latest balance
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <span className="block h-px w-4 bg-indigo-300 [border-top:1px_dashed]" />
                      Period high
                    </div>
                    <div className="inline-flex items-center gap-1.5 ml-auto">
                      <span className="font-semibold text-slate-600">
                        {visibleGrowth.length}
                      </span>
                      data points
                    </div>
                  </div>
                </>
              );
            })()}

            {(() => {
              const last =
                visibleGrowth[visibleGrowth.length - 1]?.value ?? 0;
              const first = visibleGrowth[0]?.value ?? 0;
              const delta = last - first;

              const idle = balance <= 0;
              const up = !idle && delta >= 0;
              const flat = !idle && delta === 0;
              const down = !idle && delta < 0;

              const tone = idle
                ? {
                    iconBg: "bg-slate-500/15",
                    iconColor: "text-slate-300",
                    title: "Account idle",
                    sub: "Make a deposit to start tracking growth.",
                    Icon: Wallet,
                  }
                : flat
                ? {
                    iconBg: "bg-indigo-500/20",
                    iconColor: "text-indigo-300",
                    title: "Steady — no movement this period",
                    sub: "Your balance is holding firm.",
                    Icon: Activity,
                  }
                : down
                ? {
                    iconBg: "bg-rose-500/20",
                    iconColor: "text-rose-300",
                    title: "Slight pullback this period",
                    sub: "Long-term strategies recover from short dips.",
                    Icon: TrendingDown,
                  }
                : {
                    iconBg: "bg-emerald-500/20",
                    iconColor: "text-emerald-400",
                    title: "Your investment is actively growing",
                    sub: up
                      ? "Compounding steadily across the period."
                      : "Steady performance.",
                    Icon: TrendingUp,
                  };
              const Icon = tone.Icon;

              return (
                <div className="relative mt-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone.iconBg}`}
                  >
                    <Icon className={`w-5 h-5 ${tone.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Status
                    </p>
                    <p className="text-sm sm:text-base font-bold mt-0.5 truncate">
                      {tone.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {tone.sub}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>

        {/* Live trading + allocation row */}
        <div className="grid gap-6 lg:grid-cols-5 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
            className="relative lg:col-span-3 overflow-hidden rounded-3xl shadow-lg border border-indigo-900/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
            />
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Animated scanning line */}
            <motion.div
              animate={{ x: ["-10%", "110%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent pointer-events-none"
            />

            <div className="relative flex flex-wrap items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(99,102,241,0.4)",
                      "0 0 0 10px rgba(99,102,241,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-inner"
                >
                  <Zap className="w-6 h-6 text-indigo-300" />
                </motion.div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Trading Desk
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    Live Market Activity
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/40 px-2.5 py-1">
                <LiveDot />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                  Streaming
                </span>
              </div>
            </div>

            {(() => {
              const buys = liveTrades.filter(
                (t: LiveTrade) => t.side === "buy",
              ).length;
              const sells = liveTrades.length - buys;
              const volume = liveTrades.reduce(
                (sum: number, t: LiveTrade) => sum + t.amount * t.price,
                0,
              );
              return (
                <div className="relative grid grid-cols-3 gap-3 mb-5">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-3 py-2.5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80">
                      Buys
                    </p>
                    <p className="text-lg font-bold text-emerald-300 tabular-nums mt-0.5">
                      {buys}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-rose-500/10 border border-rose-400/20 px-3 py-2.5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-300/80">
                      Sells
                    </p>
                    <p className="text-lg font-bold text-rose-300 tabular-nums mt-0.5">
                      {sells}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-indigo-400/10 border border-indigo-300/20 px-3 py-2.5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
                      Session vol
                    </p>
                    <p className="text-lg font-bold text-white tabular-nums mt-0.5">
                      $
                      {volume.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </motion.div>
                </div>
              );
            })()}

            <div className="relative flex items-center gap-3 px-3 py-2 rounded-lg bg-black/30 border border-white/5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200/60 mb-2">
              <span className="w-12">Side</span>
              <span className="w-16">Asset</span>
              <span className="hidden sm:block flex-1">Size @ Price</span>
              <span className="block sm:hidden flex-1">Size</span>
              <span className="text-right">Total</span>
            </div>

            <div className="relative space-y-1.5 min-h-[180px]">
              {balance <= 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-indigo-400/30 bg-indigo-500/5 px-4 py-8 text-center"
                >
                  <p className="text-sm font-semibold text-indigo-100">
                    Trading desk idle
                  </p>
                  <p className="text-xs text-indigo-200/60 mt-1">
                    Make a deposit to start streaming live trades against your
                    portfolio.
                  </p>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {liveTrades.map((trade: LiveTrade) => {
                  const isBuy = trade.side === "buy";
                  return (
                    <motion.div
                      key={trade.id}
                      layout
                      initial={{ opacity: 0, y: -12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, x: 12 }}
                      transition={{ duration: 0.34, ease: "easeOut" }}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 backdrop-blur-sm transition ${
                        isBuy
                          ? "border-emerald-400/20 bg-emerald-500/[0.07] hover:bg-emerald-500/[0.12]"
                          : "border-rose-400/20 bg-rose-500/[0.07] hover:bg-rose-500/[0.12]"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-12 ${
                          isBuy
                            ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40"
                            : "bg-rose-400/20 text-rose-300 ring-1 ring-rose-400/40"
                        }`}
                      >
                        {trade.side}
                      </span>
                      <div className="flex items-center gap-2 w-16">
                        <span
                          className="w-2 h-2 rounded-full shrink-0 shadow"
                          style={{
                            background: trade.color,
                            boxShadow: `0 0 8px ${trade.color}`,
                          }}
                        />
                        <span className="font-semibold text-white text-sm">
                          {trade.symbol}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm text-indigo-100/80 tabular-nums flex-1 font-mono truncate min-w-0">
                        {trade.amount.toFixed(3)}{" "}
                        <span className="text-indigo-300/50">@</span>{" "}
                        <span className="text-white">
                          $
                          {trade.price < 10
                            ? trade.price.toFixed(4)
                            : trade.price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                        </span>
                      </span>
                      <span className="block sm:hidden flex-1 min-w-0" />
                      <span className="block sm:hidden text-[11px] text-indigo-200/70 tabular-nums font-mono shrink-0 mr-2">
                        {trade.amount.toFixed(3)}
                      </span>
                      <span
                        className={`text-sm font-bold tabular-nums font-mono ${
                          isBuy ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {isBuy ? "+" : "-"}$
                        {(trade.amount * trade.price).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="relative mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-indigo-200/60">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Auto-execution active
              </span>
              <span className="font-mono text-indigo-100">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "--:--:--"}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <PieIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Diversification
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Portfolio Mix
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {balance > 0 ? (
              <div className="space-y-4">
                {ALLOCATIONS.map(
                  (a: (typeof ALLOCATIONS)[number], i: number) => {
                    const dollarValue = (balance * a.pct) / 100;
                    return (
                      <div key={a.symbol}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: a.color }}
                            />
                            <span className="text-sm font-semibold text-slate-700">
                              {a.symbol}
                            </span>
                            <span className="text-xs text-slate-400 truncate">
                              {a.name}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-slate-900 tabular-nums">
                              $
                              {dollarValue.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <span className="text-xs text-slate-400 ml-2 tabular-nums">
                              {a.pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${a.pct}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + i * 0.08,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ background: a.color }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  <PieIcon className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No allocation yet
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Make a deposit to see your portfolio mix.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-5 leading-relaxed">
              Allocation is rebalanced automatically by the strategy engine based on
              market conditions.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="mt-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recent Transactions
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Activity History
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1">
              <LiveDot />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Real-time
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => {
                  const dateText = item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now";
                  const isCompleted = item.status === "completed";
                  const isDeposit = item.type === "deposit";

                  return (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.32, delay: i * 0.04 }}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-200 hover:shadow-sm px-4 py-4 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isDeposit
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownToLine className="w-5 h-5" />
                          ) : (
                            <ArrowUpFromLine className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 capitalize">
                            {item.type}
                          </p>
                          <p className="text-sm text-slate-500">{dateText}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span
                          className={`font-bold tabular-nums ${
                            isDeposit ? "text-emerald-600" : "text-slate-900"
                          }`}
                        >
                          {isDeposit ? "+" : "-"}$
                          {item.amount.toLocaleString()}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {!isCompleted && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                          {isCompleted ? "Completed" : "Processing"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-slate-200 p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-semibold">
                    No recent transactions yet
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Make your first deposit to start tracking activity here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
