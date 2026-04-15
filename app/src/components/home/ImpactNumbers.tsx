'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const metrics = [
  { value: 28, label: 'Schools Enrolled', subLabel: 'Government high schools in Bangalore', prefix: '', suffix: '', icon: '🏫' },
  { value: 8400, label: 'Students Impacted', subLabel: 'Across grades 8–10', prefix: '', suffix: '+', icon: '👨‍🎓' },
  { value: 1.2, label: 'Funds Raised', subLabel: 'Funded by 300+ donors', prefix: '₹', suffix: 'Cr', icon: '💰', decimals: 1 },
  { value: 120, label: 'Volunteers Active', subLabel: 'Teachers & mentors on ground', prefix: '', suffix: '+', icon: '🤝' },
  { value: 4500, label: 'Stories Shared', subLabel: 'Student journeys documented', prefix: '', suffix: '+', icon: '🎬' },
  { value: 95, label: 'Retention Rate', subLabel: 'Students continuing education', prefix: '', suffix: '%', icon: '📈' },
];

export function ImpactNumbers() {
  return (
    <section className="py-20 md:py-28 relative section-spotlight">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">Our Impact</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mt-3">
            Numbers That Matter
          </h2>
          <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto">
            Every number represents a real child, a real story, and a real change in someone&apos;s life.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 md:p-8 text-center card-hover-glow group"
            >
              <span className="text-3xl mb-4 block">{metric.icon}</span>
              <div className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-text-primary mb-2">
                <AnimatedCounter
                  end={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimals={(metric as { decimals?: number }).decimals || 0}
                  className="counter-shimmer"
                />
              </div>
              <h3 className="font-display font-semibold text-sm md:text-base text-text-primary mb-1">
                {metric.label}
              </h3>
              <p className="text-text-muted text-xs md:text-sm">{metric.subLabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
