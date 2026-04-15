import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, CheckCircle2, Calculator as CalcIcon, TrendingUp, Shield } from 'lucide-react';

const steps = [
  {
    icon: Mail,
    title: "1. Free Consultation",
    description: "Connect with our retirement specialists to discuss your goals and risk tolerance."
  },
  {
    icon: Shield,
    title: "2. Secure Setup",
    description: "We help you set up a secure, professionally managed account with institutional-grade safety."
  },
  {
    icon: TrendingUp,
    title: "3. Grow Peacefully",
    description: "Watch your nest egg grow steadily with our conservative, diversified digital wealth strategies."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">
            We've simplified the complex world of digital assets into a clear, 
            dependable process tailored specifically for retirees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
                <step.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+2rem)] w-16 h-[1px] bg-slate-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
