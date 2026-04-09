import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function ReviewsStars() {
  const rating = 4.5;
  const maxRating = 5;
  const reviewCount = 1250;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
          </motion.div>
        );
      } else if (i - rating < 1) {
        stars.push(
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="relative w-7 h-7"
          >
            <Star className="w-7 h-7 text-yellow-200" />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            </div>
          </motion.div>
        );
      } else {
        stars.push(
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Star className="w-7 h-7 text-yellow-200" />
          </motion.div>
        );
      }
    }
    return stars;
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-2 mb-4">
            {renderStars()}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex items-baseline gap-2"
          >
            <h3 className="text-5xl lg:text-6xl font-bold text-slate-900">
              {rating}
            </h3>
            <span className="text-2xl text-slate-500 font-semibold">
              /{maxRating}
            </span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-slate-600 text-base mt-4"
          >
            {reviewCount.toLocaleString()} verified customer reviews
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
