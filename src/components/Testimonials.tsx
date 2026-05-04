import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

const testimonials = [
  {
    name: "Robert M.",
    age: 68,
    location: "Florida",
    flag: "🌴",
    text: "I was always curious about digital assets but terrified of the volatility. RetireSafe gave me a clear, conservative path. My portfolio has grown steadily without me ever having to look at a chart.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    metric: "+27%",
    metricLabel: "this year",
    plan: "Conservative",
  },
  {
    name: "Margaret S.",
    age: 72,
    location: "Arizona",
    flag: "🌵",
    text: "The personal consultation made all the difference. They explained everything in plain English. It's the first time I've felt 'ahead' of the curve in my retirement planning.",
    image:
      "https://images.unsplash.com/photo-1663429122432-c2769373768f?q=80&w=300&auto=format&fit=crop",
    metric: "+31%",
    metricLabel: "this year",
    plan: "Balanced",
  },
  {
    name: "David & Linda",
    age: "65 & 63",
    location: "Texas",
    flag: "⭐",
    text: "We wanted a small portion of our nest egg in digital assets for growth. RetireSafe's managed approach is exactly what we needed — professional, secure, and completely hands-off.",
    image:
      "https://images.unsplash.com/photo-1498757581981-8ddb3c0b9b07?q=80&w=300&auto=format&fit=crop",
    metric: "+24%",
    metricLabel: "this year",
    plan: "Conservative",
  },
  {
    name: "Michael P.",
    age: 70,
    location: "California",
    flag: "🌊",
    text: "The platform is incredibly easy to understand. I was worried about security, but RetireSafe's institutional-grade protocols gave me the peace of mind I needed to finally diversify into digital assets.",
    image: "https://picsum.photos/seed/michael/300/300",
    metric: "+42%",
    metricLabel: "this year",
    plan: "Growth",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i: number) => (i + 1) % testimonials.length),
      6000,
    );
    return () => clearInterval(id);
  }, [paused]);

  const featured = testimonials[active];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Animated background motion graphics */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute -bottom-40 -right-40 w-[460px] h-[460px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Client Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Real retirees,{" "}
            <span className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              real outcomes
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Stories from people who chose a safer, smarter way to grow their
            wealth in retirement.
          </p>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-3xl mx-auto"
        >
          {[
            { value: "4.9", label: "Avg. rating", suffix: "/ 5" },
            { value: "2,500+", label: "Retirees served" },
            { value: "98%", label: "Would recommend" },
            { value: "$250M", label: "Insured" },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-3 text-center"
            >
              <p className="text-xl sm:text-2xl font-bold tabular-nums bg-gradient-to-br from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {s.value}
                {s.suffix && (
                  <span className="text-xs text-slate-400 font-semibold ml-0.5">
                    {s.suffix}
                  </span>
                )}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured testimonial */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-indigo-500/5"
          >
            {/* Gradient accent bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />
            {/* Soft glows */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
            />

            <div className="relative grid lg:grid-cols-12 gap-8 p-8 sm:p-10">
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured.image}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.4 }}
                    className="relative mb-5"
                  >
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl">
                      <img
                        src={featured.image}
                        alt={featured.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-400/40 to-blue-400/40 blur-xl -z-10"
                    />
                    <span className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-lg">
                      {featured.flag}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${active}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="text-xl font-bold text-slate-900">
                      {featured.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Age {featured.age} · {featured.location}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Verified · {featured.plan}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:col-span-8 relative">
                <Quote className="absolute -top-2 -left-2 w-12 h-12 text-indigo-100" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`quote-${active}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className="relative pl-12 pt-2"
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                      "{featured.text}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-4 pl-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`metric-${active}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="inline-flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2"
                    >
                      <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                        {featured.metric}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        {featured.metricLabel}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel controls */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setActive(
                          (i: number) =>
                            (i - 1 + testimonials.length) % testimonials.length,
                        )
                      }
                      className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow transition"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setActive((i: number) => (i + 1) % testimonials.length)
                      }
                      className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow transition"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Dots */}
                <div className="mt-5 pl-12 flex items-center gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="group relative h-1.5 transition-all"
                      style={{ width: i === active ? 28 : 8 }}
                      aria-label={`Show testimonial ${i + 1}`}
                    >
                      <span
                        className={`block h-full rounded-full transition-all ${
                          i === active
                            ? "bg-gradient-to-r from-indigo-500 to-blue-600"
                            : "bg-slate-200 group-hover:bg-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mini grid of all testimonials as quick-pick chips */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => setActive(i)}
              className={`relative overflow-hidden text-left p-5 rounded-2xl border bg-white transition shadow-sm ${
                i === active
                  ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md shadow-indigo-500/10"
                  : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="testimonial-bg"
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-blue-50/60 pointer-events-none"
                />
              )}
              <div className="relative flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-[10px]">
                    {t.flag}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {t.location}
                  </p>
                </div>
              </div>
              <p className="relative text-sm text-slate-600 line-clamp-3 leading-snug">
                "{t.text}"
              </p>
              <div className="relative mt-3 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-600 tabular-nums">
                  {t.metric}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
