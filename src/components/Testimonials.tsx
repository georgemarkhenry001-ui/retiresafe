import React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Robert M.",
    age: 68,
    location: "Florida",
    text: "I was always curious about crypto but terrified of the volatility. RetireSafe gave me a clear, conservative path. My portfolio has grown steadily without me ever having to look at a chart.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Margaret S.",
    age: 72,
    location: "Arizona",
    text: "The personal consultation made all the difference. They explained everything in plain English. It's the first time I've felt 'ahead' of the curve in my retirement planning.",
    image:
      "https://images.unsplash.com/photo-1663429122432-c2769373768f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "David & Linda",
    age: "65 & 63",
    location: "Texas",
    text: "We wanted a small portion of our nest egg in digital assets for growth. RetireSafe's managed approach is exactly what we needed—professional, secure, and completely hands-off.",
    image:
      "https://images.unsplash.com/photo-1498757581981-8ddb3c0b9b07?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Michael P.",
    age: 70,
    location: "California",
    text: "The platform is incredibly easy to understand. I was worried about security, but RetireSafe's institutional-grade protocols gave me the peace of mind I needed to finally diversify into crypto.",
    image: "https://picsum.photos/seed/michael/150/150",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600">
            Real stories from retirees who chose a safer, smarter way to grow
            their wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-indigo-50" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-slate-600 italic mb-8 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">
                    {t.age} • {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}