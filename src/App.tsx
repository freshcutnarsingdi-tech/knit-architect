/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Search, Lightbulb, Code, CheckCircle, Globe, Linkedin, ArrowUp } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Search feature coming soon! You searched for: ${searchQuery}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="flex items-stretch border-b border-grid text-[9px] uppercase tracking-widest font-medium bg-[var(--color-bg-light)] sticky top-0 z-50">
      <div className="px-6 py-4 border-r border-grid flex items-center gap-2 w-48 shrink-0">
        <div className="w-3 h-3 bg-ink rounded-full" />
        <span className="font-bold">KNITArchitect</span>
      </div>
      <div className="flex flex-1">
        <Link to="/#home" className="flex-1 px-4 py-4 border-r border-grid flex items-center justify-center hover:bg-ink/5 transition-colors">Home</Link>
        <Link to="/#about" className="flex-1 px-4 py-4 border-r border-grid flex items-center justify-center hover:bg-ink/5 transition-colors">About</Link>
        <Link to="/#services" className="flex-1 px-4 py-4 border-r border-grid flex items-center justify-center hover:bg-ink/5 transition-colors">Services</Link>
        <Link to="/#resources" className="flex-1 px-4 py-4 border-r border-grid flex items-center justify-center hover:bg-ink/5 transition-colors">Resources</Link>
        <Link to="/#contact" className="flex-1 px-4 py-4 border-r border-grid flex items-center justify-center hover:bg-ink/5 transition-colors">Contact</Link>
      </div>
      <div className="flex items-stretch">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center px-4 w-48 sm:w-64">
            <Search className="w-4 h-4 text-ink/50 mr-2 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH..." 
              className="bg-transparent border-none outline-none w-full text-ink placeholder:text-ink/30"
              autoFocus
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
            />
          </form>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="px-6 py-4 flex items-center justify-center hover:bg-ink/5 transition-colors cursor-pointer"
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
    <svg viewBox="-100 -100 200 200" className="w-full max-w-md text-ink">
      <g stroke="currentColor" strokeWidth="0.5" fill="none">
        {Array.from({length: 40}).map((_, i) => {
          const angle = i * 9;
          const rx = 60 + Math.sin(i * 0.5) * 10;
          const ry = 20 + Math.cos(i * 0.5) * 10;
          return (
            <ellipse 
              key={i} 
              cx="0" cy="0" 
              rx={rx} ry={ry} 
              transform={`rotate(${angle})`} 
              strokeDasharray="2 2"
              opacity={0.4 + Math.sin(i)*0.2}
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-bg-light)] p-8 max-w-md w-full border border-grid relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink/50 hover:text-ink text-xl">&times;</button>
        <h3 className="font-serif text-2xl mb-6">Request a Service</h3>
        {submitted ? (
          <div className="text-sm text-green-700 py-8 text-center font-medium">
            Thank you! Your email client has been opened to send your request.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input type="text" name="name" placeholder="Your Name" className="w-full border-b border-grid py-2 text-sm focus:outline-none focus:border-ink bg-transparent transition-colors" required />
            </div>
            <div>
              <input type="email" name="email" placeholder="Email Address" className="w-full border-b border-grid py-2 text-sm focus:outline-none focus:border-ink bg-transparent transition-colors" required />
            </div>
            <div>
              <input type="text" name="subject" placeholder="Subject" className="w-full border-b border-grid py-2 text-sm focus:outline-none focus:border-ink bg-transparent transition-colors" required />
            </div>
            <div>
              <select name="requirement" className="w-full border-b border-grid py-2 text-sm focus:outline-none focus:border-ink bg-transparent transition-colors text-ink/70" required defaultValue="">
                <option value="" disabled>Select Requirement</option>
                <option value="product-dev">Knitwear Product Development</option>
                <option value="sourcing">Material & Yarn Sourcing</option>
                <option value="consultation">Technical Consultation</option>
                <option value="programming">Technician & Programming</option>
                <option value="qa">Production Monitoring & QA</option>
                <option value="manufacturing">Global Manufacturing Support</option>
              </select>
            </div>
            <div>
              <textarea name="message" placeholder="Detailed Message" rows={4} className="w-full border-b border-grid py-2 text-sm focus:outline-none focus:border-ink bg-transparent transition-colors resize-none" required></textarea>
            </div>
            <button type="submit" className="w-full border border-ink bg-ink text-white py-3 text-[10px] uppercase tracking-widest hover:bg-transparent hover:text-ink transition-colors mt-4 cursor-pointer">
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
      <div className="p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-grid">
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-roboto text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.02] tracking-tighter mb-12 text-ink font-extrabold uppercase"
        >
          <motion.span variants={itemVariants} className="block">Precision Knitwear</motion.span>
          <motion.span variants={itemVariants} className="block">Development &</motion.span>
          <motion.span variants={itemVariants} className="block">Global Sourcing</motion.span>
        </motion.h1>
        <motion.div 
          className="mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm max-w-[320px] mb-8 text-ink/80 leading-relaxed">
            End-to-end manufacturing solutions for modern brands. We transform your concepts into high-quality, scalable knitwear.
          </p>
          <button onClick={onOpenModal} className="border border-ink px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:bg-ink hover:text-white transition-colors cursor-pointer inline-block">
            Get a Free Consultation
          </button>
        </motion.div>
      </div>
      <div className="relative overflow-hidden min-h-[400px] lg:min-h-full flex items-center justify-center bg-ink/5">
        <motion.div style={{ scale, y }} className="absolute inset-0 w-full h-full">
          <motion.img 
            src="https://i.imgur.com/h4SaL27.jpeg" 
            alt="Technical Knitwear Manufacturing" 
            className="w-full h-full object-cover origin-center"
            referrerPolicy="no-referrer"
            initial={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
            animate={{ 
              scale: [1.2, 1.05, 1.1], 
              opacity: 1, 
              filter: "blur(0px)",
              x: ["0%", "-2%", "1%"],
              y: ["0%", "1%", "-1%"]
            }}
            transition={{ 
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
    <section id="about" className="grid grid-cols-1 lg:grid-cols-2 border-b border-grid">
      <div className="bg-[var(--color-bg-sage)] p-12 lg:p-24 relative min-h-[500px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-grid overflow-hidden">
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
        <div className="absolute top-8 left-8 bg-ink text-white text-[9px] uppercase tracking-widest px-3 py-1 z-10">
          About Us
        </div>
        <div className="relative z-10">
          <WovenGraphic />
        </div>
      </div>
      <div className="bg-[var(--color-bg-sand)] p-12 lg:p-24 flex flex-col justify-center">
        <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-12 text-ink max-w-md">
          What does technical knitwear development really mean?
        </h2>
        <div className="mt-auto">
          <p className="text-sm text-ink/80 leading-relaxed max-w-md mb-4">
            Learn about our comprehensive approach to knitwear consulting.
          </p>
          <p className="text-[11px] text-ink/60 leading-relaxed max-w-md">
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
    icon: <Layers className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  },
  {
    title: "Material & Yarn Sourcing",
    desc: "Strategic sourcing of yarns and raw materials aligned with product specifications, performance, and cost targets.",
    icon: <Search className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  },
  {
    title: "Technical Consultation",
    desc: "Knitting technology guidance, machine capability assessment, and production feasibility analysis.",
    icon: <Lightbulb className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  },
  {
    title: "Technician & Programming",
    desc: "Support for flat knitting and circular knitting programming, sampling, and technical troubleshooting.",
    icon: <Code className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  },
  {
    title: "Production Monitoring & QA",
    desc: "Ensuring production consistency, technical compliance, and efficiency throughout manufacturing.",
    icon: <CheckCircle className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  },
  {
    title: "Global Manufacturing Support",
    desc: "Production coordination and sourcing network across Bangladesh, Vietnam, and China.",
    icon: <Globe className="w-6 h-6 mb-8 text-ink/70" strokeWidth={1.5} />
  }
];

function Services() {
  return (
    <section id="services" className="bg-[var(--color-bg-light)] border-b border-grid">
      <div className="border-b border-grid px-12 py-6 flex items-center gap-4">
        <div className="w-2 h-2 bg-ink rounded-full" />
        <h2 className="text-[9px] uppercase tracking-widest font-bold">Core Services</h2>
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
            <h3 className="font-serif text-2xl mb-4 pr-4 text-ink">{s.title}</h3>
            <p className="text-[11px] text-ink/70 leading-relaxed mt-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="bg-ink text-white p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      
      <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
        <h2 className="font-serif text-2xl lg:text-3xl leading-tight mb-4">
          Explore our expertise in Product Development, Sourcing & Technical Consultation.
        </h2>
        <p className="text-sm text-white/70">
          Let's Develop a Winning Knitwear Strategy Together
        </p>
      </div>
      
      <div className="relative z-10 shrink-0">
        <button onClick={onOpenModal} className="border border-white/30 px-6 py-3 text-[9px] uppercase tracking-widest hover:bg-white hover:text-ink transition-colors cursor-pointer">
          Book a Consultation
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="p-12 lg:p-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm bg-[var(--color-bg-light)]">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 bg-ink rounded-full" />
          <span className="font-bold tracking-widest uppercase text-[10px]">KNITArchitect</span>
        </div>
        <p className="text-[11px] text-ink/70 max-w-sm mb-8 leading-relaxed">
          Open to collaboration with brands, sourcing offices, and manufacturers seeking technical knitwear development and global production support.
        </p>
        <div className="mb-8">
          <a href="mailto:jiku@knitarchitect.com" className="font-serif text-2xl hover:opacity-70 transition-opacity border-b border-ink pb-1 inline-block">
            jiku@knitarchitect.com
          </a>
        </div>

      </div>
      
      <div>
        <h4 className="text-[9px] uppercase tracking-widest font-bold mb-6">Navigation</h4>
        <ul className="space-y-4 text-[11px] text-ink/70">
          <li><Link to="/#home" className="hover:text-ink transition-colors">Home</Link></li>
          <li><Link to="/#about" className="hover:text-ink transition-colors">About Us</Link></li>
          <li><Link to="/#services" className="hover:text-ink transition-colors">Services</Link></li>
          <li><Link to="/#contact" className="hover:text-ink transition-colors">Contact</Link></li>
          <li className="pt-2 mt-2 border-t border-ink/10">
            <Link to="/#sitemap" className="hover:text-ink transition-colors font-semibold text-ink">
              Sitemap
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-[9px] uppercase tracking-widest font-bold mb-6">More</h4>
        <ul className="space-y-4 text-[11px] text-ink/70">
          <li><Link to="/careers" className="hover:text-ink transition-colors">Careers</Link></li>
          <li><Link to="/#partners" className="hover:text-ink transition-colors">Partner with Us</Link></li>
          <li className="pt-2 mt-2 border-t border-ink/10">
            <a href="https://www.linkedin.com/company/knitarchitect/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ink transition-colors">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="col-span-1 md:col-span-4 pt-8 border-t border-grid flex flex-col md:flex-row justify-between items-center text-[10px] text-ink/50 mt-8">
        <p>&copy; {new Date().getFullYear()} KNITArchitect. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#privacy" className="hover:text-ink transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-ink transition-colors">Terms of Service</a>
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
    <div className="flex-grow bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-12 lg:px-16 py-24">
        <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight">Careers</h1>
        <p className="text-lg text-ink/70 max-w-2xl mb-16 leading-relaxed">
          <strong className="text-ink font-bold block mb-2">We Are Hiring – Knitwear & Technical Specialists</strong>
          We are currently expanding our technical team and are looking for experienced professionals in the knitwear and garment technology sector. We welcome applications from skilled individuals who are passionate about knitting technology, product development, and innovation.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-serif mb-8 border-b border-ink/10 pb-4">Who We Are Looking For</h2>
            <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
              <p>We are looking for candidates with strong technical knowledge, problem-solving ability, and experience in knitwear development and production technology.</p>
              <p>Professionals with experience in flat knitting, circular knitting, sock machines, technical programming, and virtual garment development are encouraged to apply.</p>
              <p>Join us in building innovative knitwear solutions and working with global knitwear development and manufacturing partners.</p>
              
              <div className="mt-8 p-6 bg-[var(--color-bg-light)] border border-grid">
                <h3 className="font-bold text-sm tracking-wide uppercase mb-4">How to Apply</h3>
                <p className="mb-4">Please send your CV / Resume to:</p>
                <a href="mailto:jiku@knitarchitect.com" className="font-serif text-xl hover:opacity-70 transition-opacity border-b border-ink pb-1 inline-block">
                  jiku@knitarchitect.com
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-serif mb-8 border-b border-ink/10 pb-4">Open Positions</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div key={index} className="group border border-grid p-6 hover:bg-[var(--color-bg-light)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-sm tracking-wide uppercase">{position}</h3>
                  <a href={`mailto:jiku@knitarchitect.com?subject=Application: ${encodeURIComponent(position)}`} className="text-[10px] uppercase tracking-widest font-bold border-b border-ink pb-1 inline-block group-hover:opacity-70 transition-opacity whitespace-nowrap">
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
      className={`fixed bottom-8 right-8 p-3 bg-ink text-white rounded-full shadow-lg hover:bg-ink/80 transition-colors z-50 ${
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
      <div className="min-h-screen flex flex-col selection:bg-ink selection:text-white">
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
