import React from "react";
import { motion } from "motion/react";
import { Shield, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
  {
    name: "Ultra Save",
    returns: "5% - 10%",
    minInvestment: "$500",
    description:
      "Our most conservative strategy, focusing on stable, low-volatility assets to preserve your capital while beating inflation.",
    icon: Shield,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconColor: "text-emerald-600",
    features: [
      "Capital preservation focus",
      "Stablecoin & Blue-chip mix",
      "Monthly performance reports",
      "24/7 support access",
    ],
  },
  {
    name: "Balance",
    returns: "11% - 15%",
    minInvestment: "$10,000",
    description:
      "A balanced approach that combines safety with moderate growth. Ideal for retirees seeking a steady income stream.",
    icon: TrendingUp,
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
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
    returns: "16% - 20%",
    minInvestment: "$50,000",
    description:
      "Designed for those with a longer time horizon who want to maximize their retirement nest egg with managed exposure.",
    icon: Zap,
    color: "bg-amber-50 text-amber-700 border-amber-100",
    iconColor: "text-amber-600",
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
    <section id="plans" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Investment Plans
          </h2>
          <p className="text-lg text-slate-600">
            Tailored strategies designed to provide dependable returns for every
            stage of your retirement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative bg-white rounded-[40px] p-8 border-2 transition-all hover:shadow-xl",
                plan.popular
                  ? "border-indigo-600 shadow-lg scale-105 z-10"
                  : "border-slate-100 shadow-sm",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  plan.color,
                )}
              >
                <plan.icon className={cn("w-8 h-8", plan.iconColor)} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-indigo-600">
                  {plan.returns}
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  / quarterly
                </span>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Minimum Investment
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {plan.minInvestment}
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStartedClick}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all active:scale-95",
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200",
                )}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}