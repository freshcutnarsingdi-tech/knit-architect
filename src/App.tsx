/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Search, Lightbulb, Code, CheckCircle, Globe, Linkedin, ArrowUp } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import ProgressiveImage from './components/ProgressiveImage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
}

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Search feature coming soon! You searched for: ${searchQuery}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const isActive = (hash: string, path = '/') => {
    if (location.pathname !== path) return false;
    if (hash === '#home') {
      return location.hash === '' || location.hash === '#home';
    }
    return location.hash === hash;
  };

  const getLinkClass = (hash: string, path = '/') => {
    const base = "flex-1 px-4 py-5 border-r border-grid flex items-center justify-center transition-all duration-200";
    if (isActive(hash, path)) {
      return `${base} text-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/5 font-semibold`;
    }
    return `${base} text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)]/5`;
  };

  return (
    <nav className="flex items-stretch border-b border-grid text-[12px] uppercase tracking-[0.08em] font-medium bg-[var(--color-bg-light)] sticky top-0 z-50">
      <Link to="/#home" className="border-r border-grid flex items-center shrink-0 hover:bg-[var(--color-primary-blue)]/5 transition-all duration-200">
        <div className="py-6 pl-6 flex items-center shrink-0">
          <ProgressiveImage 
            src="/logo.png" 
            alt="KNITArchitect Logo" 
            className="h-6 w-auto flex items-center justify-center shrink-0 mr-6"
            imageClassName="h-6 w-auto object-contain"
            loading="eager"
            placeholderColor="bg-transparent"
          />
          <span className="font-bold text-[13px] text-[var(--color-charcoal)] pr-6">KNITArchitect</span>
        </div>
      </Link>
      <div className="flex flex-grow items-center justify-center">
        <div className="flex w-full h-full items-stretch">
          <Link to="/#home" className={getLinkClass('#home')}>Home</Link>
          <Link to="/#about" className={getLinkClass('#about')}>About</Link>
          <Link to="/#services" className={getLinkClass('#services')}>Services</Link>
          <Link to="/#contact" className={getLinkClass('#contact')}>Contact</Link>
        </div>
      </div>
      <div className="flex items-stretch border-l border-grid">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center px-6 w-56 sm:w-64">
            <Search className="w-4 h-4 text-[var(--color-warm-gray)] mr-2 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH..." 
              className="bg-transparent border-none outline-none w-full text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]/40 text-[12px] tracking-[0.08em]"
              autoFocus
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
            />
          </form>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="px-8 py-5 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)]/5 transition-all duration-200 cursor-pointer"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}

function WovenGraphic() {
  return (
    <svg viewBox="-100 -100 200 200" className="w-full max-w-md text-[var(--color-charcoal)]">
      <g stroke="currentColor" strokeWidth="0.5" fill="none">
        {Array.from({length: 40}).map((_, i) => {
          const angle = i * 9;
          const rx = 60 + Math.sin(i * 0.5) * 10;
          const ry = 20 + Math.cos(i * 0.5) * 10;
          const isAccent = i % 6 === 0;
          return (
            <ellipse 
              key={i} 
              cx="0" cy="0" 
              rx={rx} ry={ry} 
              transform={`rotate(${angle})`} 
              strokeDasharray={isAccent ? "none" : "2 2"}
              stroke={isAccent ? "var(--color-primary-blue)" : "currentColor"}
              strokeWidth={isAccent ? "0.75" : "0.5"}
              opacity={isAccent ? 0.8 : (0.4 + Math.sin(i)*0.2)}
            />
          );
        })}
      </g>
    </svg>
  );
}

function ConsultationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const requirement = formData.get('requirement');
    const message = formData.get('message');

    const mailtoSubject = encodeURIComponent(`Consultation Request: ${subject}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nRequirement: ${requirement}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:jiku@knitarchitect.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-charcoal)]/30 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-bg-light)] p-8 max-w-md w-full border border-grid relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] text-xl transition-colors duration-200">&times;</button>
        <h3 className="font-bold text-[24px] text-[var(--color-charcoal)] mb-6 leading-tight">Request a Service</h3>
        {submitted ? (
          <div className="text-[16px] text-green-700 py-8 text-center font-medium">
            Thank you! Your email client has been opened to send your request.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input type="text" name="name" placeholder="Your Name" className="w-full border-b border-grid py-2 text-[16px] text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-primary-blue)] bg-transparent transition-colors" required />
            </div>
            <div>
              <input type="email" name="email" placeholder="Email Address" className="w-full border-b border-grid py-2 text-[16px] text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-primary-blue)] bg-transparent transition-colors" required />
            </div>
            <div>
              <input type="text" name="subject" placeholder="Subject" className="w-full border-b border-grid py-2 text-[16px] text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-primary-blue)] bg-transparent transition-colors" required />
            </div>
            <div>
              <select name="requirement" className="w-full border-b border-grid py-2 text-[16px] focus:outline-none focus:border-[var(--color-primary-blue)] bg-[var(--color-bg-light)] text-[var(--color-charcoal)]" required defaultValue="">
                <option value="" disabled className="text-[var(--color-warm-gray)]/40">Select Requirement</option>
                <option value="product-dev">Knitwear Product Development</option>
                <option value="sourcing">Material & Yarn Sourcing</option>
                <option value="consultation">Technical Consultation</option>
                <option value="programming">Technician & Programming</option>
                <option value="qa">Production Monitoring & QA</option>
                <option value="manufacturing">Global Manufacturing Support</option>
              </select>
            </div>
            <div>
              <textarea name="message" placeholder="Detailed Message" rows={4} className="w-full border-b border-grid py-2 text-[16px] text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-primary-blue)] bg-transparent transition-colors resize-none" required></textarea>
            </div>
            <button type="submit" className="w-full bg-[var(--color-primary-blue)] hover:bg-[#1E52B7] text-white py-4 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 mt-4 cursor-pointer border-none shadow-md">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Smooth out the scroll progress for a more natural feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // More subtle zoom out, more pronounced parallax
  const scale = useTransform(smoothProgress, [0, 1], [1.05, 1]);
  const y = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section ref={ref} id="home" className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] border-b border-grid">
      <div className="p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-grid bg-[var(--color-bg-light)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center mb-8 self-start bg-white border border-grid rounded-lg shadow-sm"
        >
          <div className="p-6 flex items-center shrink-0">
            <ProgressiveImage 
              src="/logo.png" 
              alt="KNITArchitect Logo" 
              className="h-6 w-auto flex items-center justify-center shrink-0 mr-6"
              imageClassName="h-6 w-auto object-contain"
              loading="eager"
              placeholderColor="bg-transparent"
            />
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary-blue)] block leading-none mb-1">KNITArchitect</span>
              <span className="text-[10px] font-medium text-[var(--color-warm-gray)] uppercase tracking-[0.08em] block leading-none">Technical Development Platform</span>
            </div>
          </div>
        </motion.div>
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-sans text-[40px] md:text-[48px] leading-[1.1] tracking-tight mb-8 text-[var(--color-charcoal)] font-bold uppercase"
        >
          <motion.span variants={itemVariants} className="block">Precision Knitwear</motion.span>
          <motion.span variants={itemVariants} className="block text-[var(--color-primary-blue)]">Development &</motion.span>
          <motion.span variants={itemVariants} className="block">Global Sourcing</motion.span>
        </motion.h1>
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[16px] leading-[1.6] max-w-[420px] mb-10 text-[var(--color-warm-gray)]">
            End-to-end manufacturing solutions for modern brands. We transform your concepts into high-quality, scalable knitwear.
          </p>
          <button onClick={onOpenModal} className="bg-[var(--color-primary-blue)] hover:bg-[#1E52B7] text-white px-8 py-4 text-[12px] font-medium uppercase tracking-[0.08em] transition-all duration-300 cursor-pointer border-none shadow-md inline-block">
            Get a Free Consultation
          </button>
        </motion.div>
      </div>
      <div className="relative overflow-hidden min-h-[400px] lg:min-h-full flex items-center justify-center bg-[var(--color-charcoal)]/5">
        <motion.div style={{ scale, y }} className="absolute inset-0 w-full h-full">
          <ProgressiveImage 
            src="https://i.imgur.com/h4SaL27.jpeg" 
            alt="Technical Knitwear Manufacturing" 
            className="w-full h-full"
            imageClassName="w-full h-full object-cover origin-center animate-[pulse_2s_infinite]"
            placeholderColor="bg-neutral-200"
            loading="lazy"
            fallbackSrc="https://i.imgur.com/h4SaL27.jpeg"
            customInitial={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
            customAnimate={{ 
              scale: [1.2, 1.05, 1.1], 
              opacity: 1, 
              filter: "blur(0px)",
              x: ["0%", "-2%", "1%"],
              y: ["0%", "1%", "-1%"]
            }}
            customTransition={{ 
              opacity: { duration: 1.5, ease: "easeOut" },
              filter: { duration: 1.5, ease: "easeOut" },
              scale: { duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              x: { duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              y: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="grid grid-cols-1 lg:grid-cols-2 border-b border-grid bg-[var(--color-bg-light)]">
      <div className="bg-[var(--color-bg-light)] p-12 lg:p-24 relative min-h-[500px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-grid overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <motion.div 
            className="w-[calc(100%+60px)] h-[calc(100%+60px)] absolute -top-[30px] -left-[30px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 L60 15 M15 0 L15 60 M0 45 L60 45 M45 0 L45 60' stroke='%23000000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
            animate={{
              x: [0, -60],
              y: [0, -60]
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
          />
        </div>
        <div className="absolute top-8 left-8 border border-grid text-[var(--color-warm-gray)] text-[12px] font-medium uppercase tracking-[0.08em] px-3 py-1.5 z-10 bg-[var(--color-bg-light)]">
          About Us
        </div>
        <div className="relative z-10">
          <WovenGraphic />
        </div>
      </div>
      <div className="bg-[var(--color-bg-light)] p-12 lg:p-24 flex flex-col justify-center">
        <h2 className="font-sans text-[32px] leading-tight font-bold mb-8 text-[var(--color-charcoal)] max-w-md">
          What does technical knitwear development really mean?
        </h2>
        <div className="mt-8 space-y-6">
          <p className="text-[16px] leading-[1.6] text-[var(--color-charcoal)] font-bold max-w-md">
            Learn about our comprehensive approach to knitwear consulting.
          </p>
          <p className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] max-w-md">
            Our expertise covers the full development cycle—from concept to production execution. We provide professional knitwear development and innovation services to support brands, buying houses, and manufacturers in achieving efficient, technically optimized, and commercially viable knit products.
          </p>
        </div>
      </div>
    </section>
  );
}

const servicesList = [
  {
    title: "Knitwear Product Development",
    desc: "Structure engineering, stitch development, gauge optimization, and machine program support.",
    icon: <Layers className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  },
  {
    title: "Material & Yarn Sourcing",
    desc: "Strategic sourcing of yarns and raw materials aligned with product specifications, performance, and cost targets.",
    icon: <Search className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  },
  {
    title: "Technical Consultation",
    desc: "Knitting technology guidance, machine capability assessment, and production feasibility analysis.",
    icon: <Lightbulb className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  },
  {
    title: "Technician & Programming",
    desc: "Support for flat knitting and circular knitting programming, sampling, and technical troubleshooting.",
    icon: <Code className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  },
  {
    title: "Production Monitoring & QA",
    desc: "Ensuring production consistency, technical compliance, and efficiency throughout manufacturing.",
    icon: <CheckCircle className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  },
  {
    title: "Global Manufacturing Support",
    desc: "Production coordination and sourcing network across Bangladesh, Vietnam, and China.",
    icon: <Globe className="w-8 h-8 mb-8 text-[var(--color-primary-blue)]" strokeWidth={1.5} />
  }
];

function Services() {
  return (
    <section id="services" className="bg-[var(--color-bg-light)] border-b border-grid">
      <div className="border-b border-grid px-12 py-6 flex items-center gap-4">
        <div className="w-2 h-2 bg-[var(--color-primary-blue)] rounded-full" />
        <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-warm-gray)]">Core Services</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {servicesList.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            className={`p-12 border-grid bg-[var(--color-bg-light)] hover:-translate-y-1.5 hover:shadow-xl hover:z-10 transition-all duration-300 relative group flex flex-col min-h-[300px] ${
              i < servicesList.length - 1 ? 'border-b' : ''
            } ${
              i >= servicesList.length - 2 ? 'md:border-b-0' : ''
            } ${
              i >= servicesList.length - 3 ? 'lg:border-b-0' : ''
            } ${
              i % 2 === 0 ? 'md:border-r' : 'md:border-r-0'
            } ${
              (i + 1) % 3 !== 0 ? 'lg:border-r' : 'lg:border-r-0'
            }`}
          >
            {s.icon}
            <h3 className="font-sans text-[24px] font-bold text-[var(--color-charcoal)] group-hover:text-[var(--color-primary-blue)] mb-4 pr-4 leading-tight transition-colors duration-300">{s.title}</h3>
            <p className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] mt-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="bg-[var(--color-charcoal)] text-white p-12 lg:p-24 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      
      <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
        <h2 className="font-sans text-[32px] font-bold leading-tight mb-4">
          Explore our expertise in Product Development, Sourcing & Technical Consultation.
        </h2>
        <p className="text-[16px] leading-[1.6] text-white/80">
          Let's Develop a Winning Knitwear Strategy Together
        </p>
      </div>
      
      <div className="relative z-10 shrink-0">
        <button onClick={onOpenModal} className="bg-[var(--color-primary-blue)] hover:bg-[#1E52B7] text-white px-8 py-4 text-[12px] font-medium uppercase tracking-[0.08em] transition-all duration-300 border-none shadow-lg cursor-pointer">
          Book a Consultation
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="p-12 lg:p-24 grid grid-cols-1 md:grid-cols-4 gap-12 bg-[var(--color-bg-light)]">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center mb-6">
          <ProgressiveImage 
            src="/logo.png" 
            alt="KNITArchitect Logo" 
            className="h-6 w-auto flex items-center justify-center shrink-0 mr-6"
            imageClassName="h-6 w-auto object-contain"
            loading="lazy"
            placeholderColor="bg-transparent"
          />
          <span className="font-bold tracking-[0.08em] uppercase text-[12px] text-[var(--color-charcoal)]">KNITArchitect</span>
        </div>
        <p className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] max-w-sm mb-8">
          Open to collaboration with brands, sourcing offices, and manufacturers seeking technical knitwear development and global production support.
        </p>
        <div className="mb-8">
          <a href="mailto:jiku@knitarchitect.com" className="font-sans text-[24px] font-bold text-[var(--color-charcoal)] hover:text-[var(--color-primary-blue)] transition-colors duration-200 border-b border-[var(--color-primary-blue)] pb-1 inline-block">
            jiku@knitarchitect.com
          </a>
        </div>
      </div>
      
      <div>
        <h4 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-warm-gray)] mb-6">Navigation</h4>
        <ul className="space-y-4">
          <li><Link to="/#home" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">Home</Link></li>
          <li><Link to="/#about" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">About Us</Link></li>
          <li><Link to="/#services" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">Services</Link></li>
          <li><Link to="/#contact" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">Contact</Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-warm-gray)] mb-6">More</h4>
        <ul className="space-y-4">
          <li><Link to="/careers" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">Careers</Link></li>
          <li><Link to="/#partners" className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">Partner with Us</Link></li>
          <li className="pt-2 mt-2 border-t border-grid">
            <a href="https://www.linkedin.com/company/knitarchitect/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[16px] leading-[1.6] text-[var(--color-warm-gray)] hover:text-[var(--color-primary-blue)] transition-colors duration-200">
              <Linkedin className="w-4 h-4 text-[var(--color-primary-blue)]" />
              <span>LinkedIn</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="col-span-1 md:col-span-4 pt-8 border-t border-grid flex flex-col md:flex-row justify-between items-center text-[12px] text-[var(--color-warm-gray)] font-medium uppercase tracking-[0.08em] mt-8">
        <p>&copy; {new Date().getFullYear()} KNITArchitect. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#privacy" className="hover:text-[var(--color-primary-blue)] transition-colors duration-200">Privacy Policy</a>
          <a href="#terms" className="hover:text-[var(--color-primary-blue)] transition-colors duration-200">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

function Careers() {
  const openPositions = [
    "Stoll Programmer",
    "Shima Seiki Programmer",
    "Lonati Knitting Machine Programmer",
    "Knitting Machine Mechanic",
    "Garment Technologist – Knitwear",
    "Knitwear Chart Maker",
    "CLO 3D / Virtual Designer"
  ];

  return (
    <div className="flex-grow bg-[var(--color-bg-light)]">
      <div className="max-w-7xl mx-auto px-12 lg:px-16 py-24">
        <h1 className="text-[40px] md:text-[48px] font-sans font-bold text-[var(--color-charcoal)] mb-8 tracking-tight uppercase leading-tight">Careers</h1>
        <p className="text-[16px] leading-[1.6] text-[var(--color-warm-gray)] max-w-2xl mb-16">
          <strong className="text-[var(--color-charcoal)] font-bold block mb-4 text-[18px]">We Are Hiring – Knitwear & Technical Specialists</strong>
          We are currently expanding our technical team and are looking for experienced professionals in the knitwear and garment technology sector. We welcome applications from skilled individuals who are passionate about knitting technology, product development, and innovation.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-[32px] font-sans font-bold text-[var(--color-charcoal)] mb-8 border-b border-grid pb-4 leading-tight">Who We Are Looking For</h2>
            <div className="space-y-6 text-[16px] leading-[1.6] text-[var(--color-warm-gray)]">
              <p>We are looking for candidates with strong technical knowledge, problem-solving ability, and experience in knitwear development and production technology.</p>
              <p>Professionals with experience in flat knitting, circular knitting, sock machines, technical programming, and virtual garment development are encouraged to apply.</p>
              <p>Join us in building innovative knitwear solutions and working with global knitwear development and manufacturing partners.</p>
              
              <div className="mt-12 p-8 bg-[var(--color-bg-light)] border border-grid">
                <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-warm-gray)] mb-4">How to Apply</h3>
                <p className="mb-4 text-[16px] leading-[1.6] text-[var(--color-charcoal)] font-bold">Please send your CV / Resume to:</p>
                <a href="mailto:jiku@knitarchitect.com" className="font-sans text-[24px] font-bold text-[var(--color-charcoal)] hover:text-[var(--color-primary-blue)] transition-colors duration-200 border-b border-[var(--color-primary-blue)] pb-1 inline-block">
                  jiku@knitarchitect.com
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-[32px] font-sans font-bold text-[var(--color-charcoal)] mb-8 border-b border-grid pb-4 leading-tight">Open Positions</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div key={index} className="group border border-grid p-6 bg-white hover:border-[var(--color-primary-blue)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-[16px] text-[var(--color-charcoal)]">{position}</h3>
                  <a href={`mailto:jiku@knitarchitect.com?subject=Application: ${encodeURIComponent(position)}`} className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-primary-blue)] hover:text-[#1E52B7] transition-colors duration-200 border-b border-[var(--color-primary-blue)] pb-0.5 whitespace-nowrap">
                    Apply Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <main className="flex-grow">
      <Hero onOpenModal={onOpenModal} />
      <About />
      <Services />
      <CTA onOpenModal={onOpenModal} />
    </main>
  );
}

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-[var(--color-primary-blue)] text-white rounded-full shadow-lg hover:bg-[#1E52B7] transition-all duration-200 z-50 cursor-pointer ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-[var(--color-primary-blue)] selection:text-white bg-[var(--color-bg-light)]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
        <Footer />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <BackToTopButton />
      </div>
    </Router>
  );
}
