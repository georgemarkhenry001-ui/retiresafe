import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

export default function AccountOverview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
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

  const balance = Number(profile?.balance || 0);

  const growthData = useMemo(() => {
    const today = new Date();
    
    // Get account creation date, fallback to 38 days ago if not available
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - 38);
    
    if (profile?.createdAt) {
      const createdDate = profile.createdAt.toDate ? profile.createdAt.toDate() : new Date(profile.createdAt);
      startDate = createdDate;
    }

    // Calculate number of days from account creation to today
    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const numPoints = Math.max(12, daysDiff + 1); // At least 12 points

    // Generate offsets from createdAt to today
    const offsets: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      offsets.push(i - (numPoints - 1));
    }
    
    // Return 0 values if balance is 0
    if (balance === 0) {
      return offsets.map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);

        const label = d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });

        return {
          date: label,
          value: 0,
        };
      });
    }

    const base = balance;
    
    // Simulate growth based on balance - scale growth percentages to balance
    const growthPercentages = [-1.3, 0.4, -0.3, 1.1, 0.07, 0.3, 0.8, 0.5, 1.6, 1.2, 1.5, 1.4];
    
    return offsets.map((offset, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);

      const label = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      // Cycle through growth percentages if we have more data points than percentages
      const percentageIndex = index % growthPercentages.length;
      const percentage = growthPercentages[percentageIndex];
      const value = (base * percentage) / 100;

      return {
        date: label,
        value: Math.round((base + value) * 100) / 100,
      };
    });
  }, [balance, profile?.createdAt]);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wider text-indigo-600 font-semibold">
            Account Overview
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Welcome, {profile?.fullName || user?.email}
          </h1>
          <p className="text-slate-600 mt-2">
            Track your balance and investment growth in one place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Current Balance
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-indigo-600">
              ${balance.toLocaleString()}
            </h2>
            <p className="text-slate-500 mt-3">
              This reflects the current approved balance on your account.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 mt-8">
              <Link
                to="/deposit"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-2xl px-4 py-3 font-semibold hover:bg-indigo-700"
              >
                <ArrowDownToLine className="w-4 h-4" />
                Deposit
              </Link>

              <Link
                to="/withdrawal"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 rounded-2xl px-4 py-3 font-semibold hover:bg-slate-50"
              >
                <ArrowUpFromLine className="w-4 h-4" />
                Withdraw
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Growth Tracker
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Investment Growth
                </h3>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={growthData}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#8b7bb4"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor="#8b7bb4"
                        stopOpacity={0.08}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#d9d6e3"
                    strokeOpacity={0.7}
                    vertical={true}
                    horizontal={true}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 8, right: 8 }}
                  />

                  <YAxis
                    orientation="right"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={["dataMin - 40", "dataMax + 40"]}
                    tickFormatter={(value) => `${Number(value).toFixed(1)}`}
                  />

                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                    labelStyle={{ color: "#111827" }}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                  />

                  <Area
                    type="linear"
                    dataKey="value"
                    stroke="#8576a6"
                    strokeWidth={2.5}
                    fill="url(#growthFill)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-900 text-white p-5">
              <p className="text-sm text-slate-300">Status</p>
              <p className="text-xl font-bold mt-1">
                Your investment is actively growing
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Continue tracking your account from the overview page and submit
                deposit or withdrawal requests anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Recent Transactions
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                Activity History
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => {
                const dateText = item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString([], {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now";

                const isCompleted = item.status === "completed";

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 capitalize">
                        {item.type}
                      </p>
                      <p className="text-sm text-slate-500">{dateText}</p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="font-bold text-slate-900">
                        ${item.amount.toLocaleString()}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Processing"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500 text-sm">
                No recent transactions yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
