'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Fade Up wrapper
export function FadeUp({ children, delay = 0, duration = 0.6 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Fade In wrapper
export function FadeIn({ children, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
export function StaggerContainer({ children, delay = 0, staggerChildren = 0.15 }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item (to be placed inside StaggerContainer)
export function StaggerItem({ children }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  );
}

// Animated Counter for Statistics
export function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  // Extract number and suffix (e.g. "150+" -> number: 150, suffix: "+")
  const numericString = value.replace(/[^0-9]/g, '');
  const numericValue = parseInt(numericString, 10) || 0;
  const suffix = value.replace(/[0-9]/g, ''); // retains characters like "+", "k", "k+"
  
  useEffect(() => {
    if (!isInView) return;
    if (numericValue === 0) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const end = numericValue;
    const totalMiliseconds = duration * 1000;
    const steps = Math.min(end, 50); // cap steps at 50 to prevent stuttering
    const incrementTime = Math.max(Math.floor(totalMiliseconds / steps), 15);
    const incrementVal = Math.ceil(end / steps);
    
    const timer = setInterval(() => {
      start += incrementVal;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [isInView, numericValue, duration]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

// Infinite Client Logo Marquee Ticker
export function ClientTicker({ items = [] }) {
  // Triple the items array to ensure seamless infinite looping
  const tripleItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Left and Right Fade overlays */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-bg-custom to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-bg-custom to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex overflow-hidden">
        <motion.div
          className="flex space-x-8 whitespace-nowrap shrink-0"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 25,
            ease: 'linear',
          }}
          style={{ width: 'fit-content' }}
        >
          {tripleItems.map((logo, idx) => (
            <div
              key={idx}
              className="inline-flex h-20 w-44 items-center justify-center p-4 bg-white rounded-xl border border-borders-custom shadow-sm hover:border-accent hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
