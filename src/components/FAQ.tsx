import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const faqs = [
  {
    question: "Is my money safe with RetireSafe?",
    answer: "Security is our #1 priority. We use institutional-grade cold storage (offline) and multi-signature security protocols. We never lend out your assets or use leverage, which are the primary causes of failure in other crypto platforms."
  },
  {
    question: "How do I get my money back if I need it?",
    answer: "You have full liquidity. While we recommend a two to twelve months horizon for optimal growth, you can request a withdrawal at any time. Funds are typically returned to your linked bank account within 3-5 business days."
  },
  {
    question: "Do I need to know how to use a 'crypto wallet'?",
    answer: "Not at all. We handle all the technical aspects. You'll receive a simple monthly statement, just like a traditional brokerage or bank account. No passwords to lose, no complicated keys to manage."
  },
  {
    question: "What are your fees?",
    answer: "We believe in transparency. We charge a flat 0.375% quarterly management fee. There are no hidden performance fees, withdrawal fees, or 'gas' costs for you to worry about."
  },
  {
    question: "Is this regulated?",
    answer: "We operate as a registered investment advisor (RIA) and partner with regulated custodians. We comply with all US financial regulations and provide full tax reporting (1099-B) at the end of each year."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.question}</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", openIndex === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
