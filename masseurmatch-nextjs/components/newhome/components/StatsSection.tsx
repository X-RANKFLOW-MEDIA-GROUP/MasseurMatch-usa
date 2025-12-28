"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Users, Heart, Star, TrendingUp, Shield, Zap } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
  gradient: string;
}

const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return <div ref={nodeRef}>{count.toLocaleString()}</div>;
};

const StatCard = ({ icon, value, label, suffix = '', prefix = '', delay = 0, gradient }: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="relative group"
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Card */}
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 overflow-hidden group-hover:border-white/20 transition-colors">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Icon */}
        <motion.div
          className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors"
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Value */}
        <div className="relative z-10 mb-2">
          <motion.div
            className="text-5xl md:text-6xl font-bold text-white flex items-baseline"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.3 }}
          >
            {prefix}
            <AnimatedCounter value={value} />
            {suffix}
          </motion.div>
        </div>

        {/* Label */}
        <motion.p
          className="text-zinc-400 text-lg font-medium relative z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: delay + 0.5 }}
        >
          {label}
        </motion.p>

        {/* Animated particles */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

export function StatsSection() {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-violet-400" />,
      value: 2547,
      label: "Verified Therapists",
      suffix: "+",
      gradient: "from-violet-500/50 to-indigo-500/50",
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-400" />,
      value: 12847,
      label: "Sessions Booked",
      suffix: "+",
      gradient: "from-rose-500/50 to-pink-500/50",
    },
    {
      icon: <Star className="w-8 h-8 text-amber-400" />,
      value: 4.9,
      label: "Average Rating",
      prefix: "",
      suffix: "★",
      gradient: "from-amber-500/50 to-yellow-500/50",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      value: 98,
      label: "Satisfaction Rate",
      suffix: "%",
      gradient: "from-emerald-500/50 to-teal-500/50",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      value: 100,
      label: "Privacy Protected",
      suffix: "%",
      gradient: "from-blue-500/50 to-cyan-500/50",
    },
    {
      icon: <Zap className="w-8 h-8 text-violet-400" />,
      value: 342,
      label: "Online Right Now",
      gradient: "from-violet-500/50 to-purple-500/50",
    },
  ];

  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6"
          >
            By The Numbers
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
              Trusted by Thousands
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Join the fastest-growing platform for verified wellness professionals
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              prefix={stat.prefix}
              delay={index * 0.1}
              gradient={stat.gradient}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group relative h-16 px-10 bg-white text-black text-lg font-semibold tracking-tight overflow-hidden inline-flex items-center gap-2"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            />
            <span className="relative z-10">Join MasseurMatch Today</span>
            <TrendingUp className="w-5 h-5 relative z-10" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
