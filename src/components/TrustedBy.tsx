import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

/* Inline SVG brand wordmarks — vector smooth, no external requests */

function TeslaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 60"
      className={className}
      role="img"
      aria-label="Tesla"
    >
      <text
        x="110"
        y="44"
        textAnchor="middle"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontWeight={800}
        fontSize="40"
        letterSpacing="13"
        fill="#e31937"
      >
        TESLA
      </text>
    </svg>
  );
}

function SchwabMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 60"
      className={className}
      role="img"
      aria-label="Charles Schwab"
    >
      {/* C tile */}
      <rect x="6" y="14" width="34" height="34" rx="6" fill="#00a0df" />
      <text
        x="23"
        y="40"
        textAnchor="middle"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontWeight={800}
        fontSize="22"
        fill="#ffffff"
      >
        C
      </text>
      {/* Wordmark */}
      <text
        x="48"
        y="40"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontWeight={600}
        fontSize="22"
        fill="#003a70"
      >
        charles
      </text>
      <text
        x="125"
        y="40"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontWeight={900}
        fontSize="22"
        letterSpacing="0.5"
        fill="#003a70"
      >
        SCHWAB
      </text>
    </svg>
  );
}

function FidelityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      className={className}
      role="img"
      aria-label="Fidelity Investments"
    >
      {/* Pyramid badge */}
      <polygon points="6,46 24,12 42,46" fill="#00945c" />
      <polygon points="14,46 24,28 34,46" fill="#3aaa78" />
      {/* Wordmark */}
      <text
        x="52"
        y="36"
        fontFamily="Georgia, ui-serif, serif"
        fontStyle="italic"
        fontWeight={700}
        fontSize="28"
        fill="#00945c"
      >
        Fidelity
      </text>
      <text
        x="52"
        y="50"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
        fontSize="9"
        letterSpacing="3"
        fill="#00945c"
      >
        INVESTMENTS
      </text>
    </svg>
  );
}

function VanguardMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      className={className}
      role="img"
      aria-label="Vanguard"
    >
      {/* Chevron */}
      <polygon points="8,12 28,12 18,46" fill="#962525" />
      {/* Wordmark */}
      <text
        x="40"
        y="42"
        fontFamily="Georgia, ui-serif, serif"
        fontWeight={700}
        fontSize="32"
        fill="#962525"
      >
        Vanguard
      </text>
    </svg>
  );
}

type Partner = {
  name: string;
  category: string;
  Mark: ({ className }: { className?: string }) => any;
  /** Per-logo height so heavier marks sit smaller for optical balance */
  heightClass?: string;
};

const partners: Partner[] = [
  {
    name: "Tesla",
    category: "Innovation Partner",
    Mark: TeslaMark,
    heightClass: "h-7 sm:h-9",
  },
  {
    name: "Charles Schwab",
    category: "Custody & Brokerage",
    Mark: SchwabMark,
    heightClass: "h-9 sm:h-11",
  },
  {
    name: "Fidelity Investments",
    category: "Asset Management",
    Mark: FidelityMark,
    heightClass: "h-10 sm:h-12",
  },
  {
    name: "Vanguard",
    category: "Index Strategies",
    Mark: VanguardMark,
    heightClass: "h-9 sm:h-11",
  },
];

export default function TrustedBy() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Animated background motion graphics */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute -bottom-32 -right-32 w-[380px] h-[380px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none"
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
            <ShieldCheck className="w-3.5 h-3.5" />
            Trusted Partners
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Backed by leaders in{" "}
            <span className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              finance and innovation
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We work alongside the institutions retirees already know and
            recognize — bringing the same standards of trust to digital
            wealth.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {partners.map((partner, i) => {
            const Mark = partner.Mark;
            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all"
              >
                {/* Top gradient accent on hover */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Soft glow blob */}
                <motion.span
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  className="absolute -top-16 -right-12 w-40 h-40 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none"
                />

                <div className="relative h-full p-6 sm:p-7 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px]">
                  <div className="flex-1 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                    <Mark
                      className={`w-auto max-w-full ${
                        partner.heightClass ?? "h-9 sm:h-11"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {partner.category}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
