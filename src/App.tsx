/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Search, Lightbulb, Code, CheckCircle, Globe, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

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
        <Link to="/#contact" className="flex-1 px-4 py-4 flex items-center justify-center hover:bg-ink/5 transition-colors">Contact</Link>
      </div>
    </nav>
  );
}

function KnitHeroGraphic() {
  const size = 60;
  const elements = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = (i - size/2) * 3.5;
      const y = (j - size/2) * 3.5;
      const dist = Math.abs(i - size/2) + Math.abs(j - size/2);
      if (dist < 28) {
        const wave = Math.sin(i * 0.15) * Math.cos(j * 0.15) * 4;
        elements.push(
          <text key={`${i}-${j}`} x={x + wave} y={y - wave} fontSize="3.5" fontFamily="monospace" fill="currentColor" opacity={0.15 + (28-dist)/35}>
            {i % 2 === 0 ? 'v' : 'V'}
          </text>
        );
      }
    }
  }
  return (
    <motion.svg 
      viewBox="-120 -120 240 240" 
      className="w-full max-w-2xl text-ink"
      animate={{ 
        y: [0, -10, 0],
        opacity: [0.85, 1, 0.85]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      whileHover={{ 
        scale: 1.05,
        rotate: 2,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
      }}
    >
      <g transform="scale(1.4, 0.8) rotate(45)">
        {elements}
      </g>
    </motion.svg>
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
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] border-b border-grid">
      <div className="p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-grid">
        <h1 className="font-serif text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.05] tracking-tight mb-16 text-ink">
          Technical Knitwear<br/>Development &<br/>Global Sourcing
        </h1>
        <div className="mt-auto">
          <p className="text-xs max-w-[250px] mb-6 text-ink/80 leading-relaxed">
            The Time to Act is Now,<br/>Together we can Transform<br/>Your Knit Production
          </p>
          <button onClick={onOpenModal} className="border border-ink px-6 py-2 text-[9px] uppercase tracking-widest hover:bg-ink hover:text-white transition-colors cursor-pointer inline-block">
            Get a Free Consultation
          </button>
        </div>
      </div>
      <div className="p-12 flex items-center justify-center relative overflow-hidden">
        <KnitHeroGraphic />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="grid grid-cols-1 lg:grid-cols-2 border-b border-grid">
      <div className="bg-[var(--color-bg-sage)] p-12 lg:p-24 relative min-h-[500px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-grid">
        <div className="absolute top-8 left-8 bg-ink text-white text-[9px] uppercase tracking-widest px-3 py-1">
          About Us
        </div>
        <WovenGraphic />
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
          <div key={i} className="p-12 border-b border-grid md:border-r md:even:border-r-0 lg:even:border-r lg:[&:nth-child(3n)]:border-r-0 hover:bg-ink/5 transition-colors group flex flex-col min-h-[300px]">
            {s.icon}
            <h3 className="font-serif text-2xl mb-4 pr-4 text-ink">{s.title}</h3>
            <p className="text-[11px] text-ink/70 leading-relaxed mt-auto">{s.desc}</p>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-ink/70">
          <div>
            <h4 className="text-[9px] uppercase tracking-widest font-bold mb-2 text-ink">UK Office</h4>
            <p>1 Hamilton Street<br />Leicester<br />United Kingdom</p>
          </div>
          <div>
            <h4 className="text-[9px] uppercase tracking-widest font-bold mb-2 text-ink">Bangladesh Office</h4>
            <p>Baluka<br />Mymenshingh<br />Bangladesh</p>
          </div>
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
      </div>
    </Router>
  );
}
