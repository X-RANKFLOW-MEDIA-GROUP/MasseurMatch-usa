'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function ComingSoonContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const launchDate = new Date('2025-03-01T00:00:00').getTime();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  // EXTRAORDINARY AAA-LEVEL ANIMATIONS
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ═══════════════════════════════════════════════════════════
      // 1. CINEMATIC HERO ENTRANCE - Like Apple Product Launches
      // ═══════════════════════════════════════════════════════════

      const masterTL = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      // Fade in from pure black with glow
      masterTL.from(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut',
      });

      // Title: Cinematic reveal with light beam effect
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        const letters = text.split('').map(char =>
          char === ' ' ? '&nbsp;' : char
        );

        titleRef.current.innerHTML = letters.map((letter, i) =>
          `<span class="letter inline-block" style="display:inline-block;transform-origin:50% 100%">${letter}</span>`
        ).join('');

        // Stagger with perspective and light sweep
        masterTL.from('.letter', {
          opacity: 0,
          y: 200,
          rotationX: -90,
          scale: 0,
          filter: 'blur(20px) brightness(3)',
          stagger: {
            each: 0.04,
            from: 'center',
            ease: 'power2.out'
          },
          duration: 1.8,
          ease: 'expo.out',
        }, 0.5);

        // Light sweep effect
        masterTL.to('.letter', {
          filter: 'brightness(1.5)',
          stagger: {
            each: 0.02,
            from: 'start'
          },
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        }, 1.5);
      }

      // Subtitle: Typewriter effect with elegant fade
      if (subtitleRef.current) {
        const words = subtitleRef.current.textContent?.split(' ') || [];
        subtitleRef.current.innerHTML = words.map(word =>
          `<span class="subtitle-word inline-block mr-2 opacity-0">${word}</span>`
        ).join('');

        masterTL.to('.subtitle-word', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.05,
          duration: 0.6,
          ease: 'power3.out',
        }, '-=1');
      }

      // Badge: Magnetic pull-in effect
      masterTL.from('.hero-badge', {
        scale: 0,
        rotation: -720,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.5,
        ease: 'elastic.out(1, 0.6)',
      }, 0.3);

      // ═══════════════════════════════════════════════════════════
      // 2. HOLOGRAPHIC COUNTDOWN - Futuristic glowing numbers
      // ═══════════════════════════════════════════════════════════

      masterTL.from('.countdown-box', {
        opacity: 0,
        scale: 0.3,
        rotationY: 180,
        z: -500,
        filter: 'blur(15px)',
        stagger: {
          each: 0.15,
          from: 'edges',
          ease: 'back.out(2)'
        },
        duration: 1.5,
        ease: 'expo.out',
      }, '-=0.8');

      // Continuous holographic glow pulse
      gsap.to('.countdown-box', {
        boxShadow: '0 0 40px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      });

      // Floating with micro-rotations
      gsap.to('.countdown-box', {
        y: -20,
        rotationX: 'random(-3, 3)',
        rotationY: 'random(-3, 3)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.4,
          from: 'random'
        },
      });

      // ═══════════════════════════════════════════════════════════
      // 3. LIQUID MORPHING BACKGROUND - Award-winning fluid motion
      // ═══════════════════════════════════════════════════════════

      const orbs = ['.gradient-orb-1', '.gradient-orb-2', '.gradient-orb-3'];
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: () => `random(-${200 + i * 50}, ${200 + i * 50})`,
          y: () => `random(-${200 + i * 50}, ${200 + i * 50})`,
          scale: () => `random(${0.8 + i * 0.1}, ${1.5 + i * 0.1})`,
          rotation: 360 * (i % 2 === 0 ? 1 : -1),
          duration: () => `random(${20 + i * 5}, ${30 + i * 5})`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // ═══════════════════════════════════════════════════════════
      // 4. PREMIUM FORM - Magnetic hover + ripple effect
      // ═══════════════════════════════════════════════════════════

      masterTL.from(formRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        filter: 'blur(30px)',
        duration: 1.2,
        ease: 'expo.out',
      }, '-=0.5');

      // ═══════════════════════════════════════════════════════════
      // 5. FEATURE CARDS - 3D carousel reveal
      // ═══════════════════════════════════════════════════════════

      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.feature-card', {
            opacity: 0,
            y: 150,
            rotationX: -45,
            rotationY: -45,
            scale: 0.5,
            z: -500,
            filter: 'blur(20px)',
            stagger: {
              each: 0.2,
              from: 'start',
              ease: 'expo.out'
            },
            duration: 1.8,
            ease: 'expo.out',
          });
        },
      });

      // Continuous 3D floating dance
      gsap.to('.feature-card', {
        y: () => `random(-25, -10)`,
        x: () => `random(-10, 10)`,
        rotationX: () => `random(-5, 5)`,
        rotationY: () => `random(-5, 5)`,
        duration: () => `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.6,
          from: 'random'
        },
      });

      // Advanced hover: Magnetic attraction + glow
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.08,
            z: 100,
            rotationX: 0,
            rotationY: 0,
            boxShadow: '0 30px 60px rgba(255,255,255,0.3)',
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            z: 0,
            boxShadow: '0 0 0 rgba(255,255,255,0)',
            duration: 0.4,
            ease: 'power2.out',
          });
        });
      });

      // ═══════════════════════════════════════════════════════════
      // 6. STATS - Counter animation with particle burst
      // ═══════════════════════════════════════════════════════════

      ScrollTrigger.create({
        trigger: '.stats-section',
        start: 'top 70%',
        onEnter: () => {
          gsap.from('.stat-item', {
            opacity: 0,
            scale: 0,
            rotationY: 360,
            filter: 'blur(20px)',
            stagger: 0.25,
            duration: 1.5,
            ease: 'expo.out',
          });

          // Shimmer effect on icons
          gsap.to('.stat-item .inline-flex', {
            scale: 1.15,
            filter: 'brightness(1.5)',
            boxShadow: '0 0 50px rgba(255,255,255,0.6)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.3,
          });
        },
      });

      // ═══════════════════════════════════════════════════════════
      // 7. PREMIUM MOUSE PARALLAX - Multi-layer depth
      // ═══════════════════════════════════════════════════════════

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;

        // Layer 1: Deep background
        gsap.to('.gradient-orb-1', {
          x: x * 60,
          y: y * 60,
          duration: 1.5,
          ease: 'power2.out',
        });

        // Layer 2: Mid ground
        gsap.to('.gradient-orb-2', {
          x: -x * 40,
          y: -y * 40,
          duration: 1.2,
          ease: 'power2.out',
        });

        // Layer 3: Foreground
        gsap.to('.gradient-orb-3', {
          x: x * 80,
          y: -y * 80,
          duration: 1.8,
          ease: 'power2.out',
        });

        // Subtle tilt on hero content
        gsap.to('.hero-content', {
          rotationY: x * 2,
          rotationX: -y * 2,
          duration: 0.8,
          ease: 'power2.out',
        });

        setMousePos({ x: clientX, y: clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // ═══════════════════════════════════════════════════════════
      // 8. GRID PATTERN - Infinite scroll animation
      // ═══════════════════════════════════════════════════════════

      gsap.to('.grid-pattern', {
        backgroundPosition: '400px 400px',
        duration: 120,
        repeat: -1,
        ease: 'none',
      });

      // ═══════════════════════════════════════════════════════════
      // 9. MICRO-INTERACTIONS - Button magnetism
      // ═══════════════════════════════════════════════════════════

      const buttons = gsap.utils.toArray<HTMLElement>('button');
      buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, {
            scale: 1.05,
            boxShadow: '0 15px 35px rgba(255,255,255,0.4)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            scale: 1,
            boxShadow: '0 0 0 rgba(255,255,255,0)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cinematic form exit
    gsap.to(formRef.current, {
      scale: 0.8,
      opacity: 0,
      rotationX: -90,
      filter: 'blur(20px)',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => {
        setSubmitted(true);

        // Success entrance with particle burst
        gsap.from('.success-card', {
          scale: 0,
          opacity: 0,
          rotation: 360,
          filter: 'blur(30px)',
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
        });
      },
    });

    console.log('Email submitted:', email);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms connect you with the perfect massage therapist based on your preferences and needs',
      gradient: 'from-slate-600 to-slate-700',
    },
    {
      icon: Calendar,
      title: 'Seamless Booking',
      description: 'Real-time availability and instant booking confirmation. Schedule your wellness journey in seconds',
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Professionals',
      description: 'Every therapist is licensed, certified, and background-checked for your safety and peace of mind',
      gradient: 'from-slate-700 to-slate-800',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Connect directly with therapists to discuss your wellness goals and customize your experience',
      gradient: 'from-slate-600 to-slate-700',
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-slate-950 perspective-container overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-10 h-10 border-2 border-white/50 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-200"
        style={{
          left: mousePos.x - 20,
          top: mousePos.y - 20,
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50"
        style={{
          left: mousePos.x - 4,
          top: mousePos.y - 4,
        }}
      />

      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Liquid Morphing Orbs */}
        <div className="gradient-orb-1 absolute -top-1/3 -left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-white/15 via-slate-300/10 to-transparent rounded-full blur-3xl" />
        <div className="gradient-orb-2 absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-slate-400/12 via-white/8 to-transparent rounded-full blur-3xl" />
        <div className="gradient-orb-3 absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-slate-300/10 via-white/6 to-transparent rounded-full blur-3xl" />

        {/* Premium Grid */}
        <div className="grid-pattern absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.04)_2px,transparent_2px)] bg-[size:80px_80px] opacity-30" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="hero-content container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center">
          {/* Premium Badge */}
          <div className="hero-badge mb-16 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="text-sm font-semibold text-white tracking-widest uppercase">Launching Soon</span>
          </div>

          {/* Cinematic Title */}
          <h1
            ref={titleRef}
            className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-12 text-center leading-none tracking-tighter"
          >
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-2xl">
              Coming Soon
            </span>
          </h1>

          {/* Elegant Subtitle */}
          <p
            ref={subtitleRef}
            className="text-2xl md:text-3xl lg:text-4xl text-slate-300 mb-20 max-w-4xl text-center font-light leading-relaxed tracking-wide"
          >
            The future of wellness connections.{' '}
            <span className="text-white font-semibold">Premium matching</span> for massage professionals and clients.
          </p>

          {/* Holographic Countdown */}
          <div className="grid grid-cols-4 gap-6 md:gap-8 mb-20 w-full max-w-4xl">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="countdown-box group relative transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-slate-400/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-white/40 transition-all duration-500">
                  <div className="text-6xl md:text-8xl font-black bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4 tabular-nums drop-shadow-lg">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-slate-400 uppercase tracking-[0.3em] font-bold">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Form */}
          {!submitted ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full max-w-2xl"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-slate-200/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="flex-1 px-8 py-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-white/60 focus:bg-slate-800/70 transition-all duration-300 text-lg backdrop-blur-xl"
                    />
                    <button
                      type="submit"
                      className="group/btn px-10 py-5 bg-gradient-to-r from-white via-slate-100 to-white text-slate-950 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/50"
                    >
                      Get Early Access
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-base text-slate-500 mt-6 text-center font-medium">
                Join <span className="text-white font-bold text-lg">2,847</span> professionals and clients on the waitlist
              </p>
            </form>
          ) : (
            <div className="success-card w-full max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-slate-200/30 rounded-3xl blur-2xl opacity-80" />
                <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/40 rounded-3xl p-12 text-center shadow-2xl">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white to-slate-200 rounded-full mb-6 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-slate-950" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4">You&apos;re on the list!</h3>
                  <p className="text-slate-300 text-xl leading-relaxed">
                    We&apos;ll notify you the moment we launch. Get ready for something extraordinary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="container mx-auto px-6 py-32">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Premium Features
            </h2>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of wellness professional matching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative transform-gpu"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative h-full bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-10 hover:border-white/40 transition-all duration-500 shadow-2xl">
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-8 shadow-2xl`}>
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section container mx-auto px-6 py-32">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-slate-200/15 to-white/15 rounded-[3rem] blur-3xl" />
            <div className="relative bg-slate-900/30 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-16 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  { icon: Star, value: '500+', label: 'Verified Therapists Ready' },
                  { icon: Zap, value: '10+', label: 'Major Cities Launching' },
                  { icon: CheckCircle2, value: '100%', label: 'Premium Experience' },
                ].map((stat, index) => (
                  <div key={index} className="stat-item text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white to-slate-200 rounded-3xl mb-6 shadow-2xl">
                      <stat.icon className="w-10 h-10 text-slate-950" strokeWidth={2.5} />
                    </div>
                    <div className="text-7xl font-black bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent mb-4">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-xl font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-slate-600 text-lg font-medium">
            © 2025 MasseurMatch. Premium wellness connections.
          </p>
        </div>
      </div>
    </div>
  );
}
