import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Hero({ onContactClick }: { onContactClick: () => void }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Shield className="w-3.5 h-3.5" />
              Trusted by 2,500+ Retirees
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Secure Your Retirement with <span className="text-indigo-600">Steady</span> Digital Wealth.
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Conservative digital wealth strategies designed for dependable returns while protecting what you’ve built.
              We manage the complexity, you enjoy the peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onContactClick}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                Start Your Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#calculator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-slate-600 hover:bg-slate-100 transition-all text-center"
              >
                Calculate Returns
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              {[
                "Fully Managed Portfolios",
                "Low-Risk Diversification",
                "No Technical Knowledge Needed"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy retiree couple" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Avg. Quarterly Return</div>
                  <div className="text-2xl font-bold text-slate-900">13%</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                *Based on our 2024 Conservative Growth Portfolio performance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
