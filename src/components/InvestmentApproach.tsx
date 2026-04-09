import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, PieChart, Lock, Zap } from 'lucide-react';

const principles = [
  {
    icon: ShieldCheck,
    title: "Capital Preservation First",
    description: "Our primary goal is protecting your principal. We use hedging strategies to minimize downside risk during market volatility."
  },
  {
    icon: PieChart,
    title: "Blue-Chip Diversification",
    description: "We focus on established assets like Bitcoin and Ethereum, avoiding speculative 'altcoins' that carry unnecessary risk."
  },
  {
    icon: Lock,
    title: "Institutional Custody",
    description: "Your assets are held in cold storage with multi-signature security, the same level used by major banks and hedge funds."
  },
  {
    icon: Zap,
    title: "Automated Rebalancing",
    description: "Our algorithms continuously monitor your portfolio, selling high and buying low to maintain your target risk profile."
  }
];

export default function InvestmentApproach() {
  return (
    <section id="approach" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              A Conservative Approach to a Modern Asset Class
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Most crypto platforms focus on high-speed trading and extreme volatility. 
              We take the opposite approach. By applying traditional wealth management 
              principles to digital assets, we provide retirees with a way to capture 
              crypto's growth without the typical stress.
            </p>
            
            <div className="space-y-4">
              {[
                "No leverage or high-risk lending",
                "Quarterly performance reviews",
                "Direct access to your dedicated advisor",
                "Transparent, flat-fee structure"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <p.icon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
