import React from 'react';
import { motion } from 'motion/react';

export default function TrustedBy() {
  const partners = [
    {
      name: 'Tesla',
      logo: 'https://dwglogo.com/wp-content/uploads/2016/03/Tesla_Logo.png',
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex items-center justify-center p-4 sm:p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:shadow-lg min-w-[140px]"
            >
              <div className="text-center flex flex-col items-center gap-3">
                <div className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {partner.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
