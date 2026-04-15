import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calculator as CalcIcon, Info } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

export default function ProfitCalculator() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(24);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');

  const data = useMemo(() => {
    // Yearly rates
    const rates = { low: 0.065, medium: 0.09, high: 0.12 };
    const rate = rates[risk];
    const chartData = [];
    
    // Calculate years
    const totalYears = Math.ceil(months / 12);
    
    for (let i = 0; i <= totalYears; i++) {
      const balance = amount * Math.pow(1 + rate, i);
      chartData.push({
        label: i === 0 ? 'Start' : `Y${i}`,
        balance: Math.round(balance),
      });
    }
    return chartData;
  }, [amount, months, risk]);

  const finalBalance = data[data.length - 1].balance;
  const totalProfit = finalBalance - amount;

  return (
    <section id="calculator" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Retirement Growth Calculator</h2>
          <p className="text-lg text-slate-600">
            See how a steady, conservative digital wealth strategy could enhance your golden years.
          </p>
        </div>

        <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-200 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Inputs */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Initial Investment: <span className="text-indigo-600 ml-2">{formatCurrency(amount)}</span>
                </label>
                <input 
                  type="range" 
                  min="500" 
                  max="1000000" 
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                  <span>$500</span>
                  <span>$1M</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Investment Duration: <span className="text-indigo-600 ml-2">{months} Months ({Math.round(months/12 * 10) / 10} Years)</span>
                </label>
                <input 
                  type="range" 
                  min="6" 
                  max="120" 
                  step="6"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                  <span>6 Months</span>
                  <span>10 Years</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Risk Tolerance (Yearly Returns)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', label: 'Low', rate: '5-8%', desc: 'Ultra Save' },
                    { id: 'medium', label: 'Medium', rate: '8-10%', desc: 'Balance' },
                    { id: 'high', label: 'High', rate: '10-14%', desc: 'Growth' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRisk(r.id as any)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left",
                        risk === r.id 
                          ? "border-indigo-600 bg-white shadow-md" 
                          : "border-slate-200 bg-transparent hover:border-slate-300"
                      )}
                    >
                      <div className={cn("text-lg font-bold", risk === r.id ? "text-indigo-600" : "text-slate-900")}>
                        {r.rate}
                      </div>
                      <div className="text-xs font-medium text-slate-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-1">Total Estimated Profit</div>
                  <div className="text-3xl font-bold text-emerald-600">+{formatCurrency(totalProfit)}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-1">Projected Balance</div>
                  <div className="text-3xl font-bold text-slate-900">{formatCurrency(finalBalance)}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Balance']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
