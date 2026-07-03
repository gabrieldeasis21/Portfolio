import * as THREE from 'three'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import ProfileCard from './components/ProfileCard'
import ToolsSection from './components/ToolsSection'
import { AnimatedTextGenerate } from './components/AnimatedTextGenerate'
import ScrollReveal from './components/ScrollReveal'
import { Github, Linkedin, Globe } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// --- 1. SETUP & PRELOADS ---
extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/assets/tag.glb')
useTexture.preload('/assets/string.png')
useTexture.preload('/assets/my-badge-photo.png')

// Error boundary for WebGL/Canvas failures
class CanvasErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('Canvas/WebGL error:', error, info); }
  render() {
    if (this.state.hasError) return this.props.fallback || null;
    return this.props.children;
  }
}

// --- 2. MAIN APP COMPONENT ---
export default function App() {

  const [expandedService, setExpandedService] = useState(null);

  // --- FORM LOGIC ---
  const [formState, setFormState] = useState('idle'); // 'idle', 'submitting', 'success'
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate sending data
    setTimeout(() => {
        setFormState('success');
    }, 1500);
  };

  // --- SCROLL ANIMATION LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 }); 

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="app-container">
      
      {/* NAV */}
      <nav className="nav">
        <a href="#intro" className="nav__link" onClick={(e) => { e.preventDefault(); document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' }); }}>Intro</a>
        <a href="#about" className="nav__link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>
        <a href="#services" className="nav__link" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
        <a href="#creative-work" className="nav__link" onClick={(e) => { e.preventDefault(); document.getElementById('creative-work')?.scrollIntoView({ behavior: 'smooth' }); }}>Projects</a>
        <a href="#contact" className="nav__link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
      </nav>

      {/* 1. INTRO / HERO SECTION */}
      <section id="intro" className="hero min-h-screen w-full">
        <img 
            src="/assets/portfolio_text.png" 
            alt="Gabriel De Asis" 
            className="hero__logo w-[95%] sm:w-[90%] md:w-[85%] max-w-500"
        />
        <div className="badge-container">
          <CanvasErrorBoundary fallback={<div className="w-full h-full" />}>
          <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
            <ambientLight intensity={Math.PI} />
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
              <Band />
            </Physics>
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
          </CanvasErrorBoundary>
        </div>
      </section>

      {/* 2. CONTENTS SECTION (With Array Text Overlay) */}
      <section id="contents" className="contents-section reveal">
         <div className="contents-container">
            <img 
                src="/assets/contents.png" 
                alt="Table of Contents" 
                className="contents-image"
            />
            
            {/* NEW: Text Overlay */}
            <div className="contents-overlay absolute top-1/2 md:top-[60%] left-4 sm:left-6 md:left-[8%] -translate-y-1/2 z-10 max-w-[90%]">
                <nav className="array-nav flex flex-col gap-3 sm:gap-4 md:gap-6 items-start">
                    <a href="#about" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<1>'}</span> ABOUT ME
                    </a>
                    <a href="#services" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<2>'}</span> SERVICES
                    </a>
                    <a href="#creative-work" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<3>'}</span> CREATIVE WORK
                    </a>
                    <a href="#contact" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<4>'}</span> CONTACT
                    </a>
                </nav>
            </div>
         </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="about" style={{ padding: 'clamp(6rem, 10vh, 8rem) 0' }}>
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)] mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-(--gutter)">ABOUT ME</h2>
        <div className="about__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_1.5fr_1fr_1fr] items-start gap-10 lg:gap-14 xl:gap-18 px-4 md:px-8 lg:px-(--gutter)">
            {/* Profile Card */}
            <div className="reveal flex items-start justify-center md:col-span-2 lg:col-span-1 lg:row-span-1 lg:sticky lg:top-32">
              <ProfileCard
                img="/assets/222211.jpg"
                name="Gabriel De Asis"
                position="Software, Cloud, and UI/UX Specialist"
                bio="Specialized in building modern web applications, intuitive user interfaces, and cloud-based solutions that help businesses streamline workflows, strengthen their online presence, and achieve their goals."
                spotlight
                spotlightColor="59,130,246"
                skills={[
                  { name: 'React', icon: Globe },
                  { name: 'JavaScript', icon: Globe },
                  { name: 'UI/UX', icon: Globe },
                  { name: 'Branding', icon: Globe },
                ]}
                socialLinks={[
                  { name: 'GitHub', url: 'https://github.com/gabrieldeasis21', icon: Github },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/deasisgabriel', icon: Linkedin },
                ]}
              />
            </div>

            <div className="about__column about__column--bio reveal md:col-span-2 lg:col-span-1">
                <h3 className="about__label">HI I'M</h3>
                <div className="about__name-large text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">
                    <span>Gabriel</span>
                    <span>De Asis</span>
                </div>
                <ScrollReveal 
                    baseOpacity={0.1} 
                    enableBlur={true} 
                    baseRotation={2}
                    blurStrength={3}
                    containerClassName="about__scroll-reveal"
                    textClassName="about__text text-sm sm:text-base md:text-lg"
                >
                    Your technology partner for building modern digital solutions, from intuitive user experiences to scalable web applications and cloud-based systems.
                </ScrollReveal>
                <ScrollReveal 
                    baseOpacity={0.1} 
                    enableBlur={true} 
                    baseRotation={2}
                    blurStrength={3}
                    containerClassName="about__scroll-reveal"
                    textClassName="about__text text-sm sm:text-base md:text-lg"
                >
                    I combine software engineering, cloud technologies, UI/UX design, and technical virtual assistance to create solutions that improve workflows, strengthen your online presence, and support business growth.
                </ScrollReveal>
            </div>

            <div className="about__column about__column--education reveal">
                <h3 className="about__label">EDUCATIONAL BACKGROUND</h3>
                <div className="timeline">
                    <TimelineItem year="2023 - Present" title="Bachelor Of Science in Computer Science" place="Cavite State University" />
                    <TimelineItem year="2020 - 2023" title="Science, Technology, Engineering, and Mathematics" place="National College of Science & Technology" />
                </div>
            </div>

            <div className="about__column about__column--career reveal">
                <h3 className="about__label">EXPERIENCE</h3>
                <div className="timeline">
                    <TimelineItem year="2026 - Present " title="Full-Stack Developer" place="CvSU Research Extension" />
                    <TimelineItem year="2024 - 2025" title="UI/UX Designer" place="Remote" />
                    <TimelineItem year="2023 - 2024" title="Social Media Manager" place="Kaffatea" />
                </div>
            </div>
        </div>
      </section>

      {/* 3.5 TOOLS & TECHNOLOGIES SECTION */}
      <ToolsSection />

      {/* 4. SERVICES SECTION */}
      <section id="services" className="works">
        {/* Top Carousel Border */}
        <div className="tools-carousel overflow-hidden">
          <div className="tools-carousel__wrapper tools-carousel__wrapper--reverse">
            <div className="tools-carousel__track">
              {[
                { id: 1, name: 'Tool 1', src: '/assets/SERVICES.png' },
                { id: 2, name: 'Tool 2', src: '/assets/SERVICES.png' },
                { id: 3, name: 'Tool 3', src: '/assets/SERVICES.png' },
                { id: 4, name: 'Tool 4', src: '/assets/SERVICES.png' },
                { id: 5, name: 'Tool 5', src: '/assets/SERVICES.png' },
                { id: 6, name: 'Tool 6', src: '/assets/SERVICES.png' },
                { id: 7, name: 'Tool 7', src: '/assets/SERVICES.png' },
                { id: 8, name: 'Tool 8', src: '/assets/SERVICES.png' },
              ].map(tool => (
                <div key={`top-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="tools-carousel__track" aria-hidden="true">
              {[
                { id: 1, name: 'Tool 1', src: '/assets/SERVICES.png' },
                { id: 2, name: 'Tool 2', src: '/assets/SERVICES.png' },
                { id: 3, name: 'Tool 3', src: '/assets/SERVICES.png' },
                { id: 4, name: 'Tool 4', src: '/assets/SERVICES.png' },
                { id: 5, name: 'Tool 5', src: '/assets/SERVICES.png' },
                { id: 6, name: 'Tool 6', src: '/assets/SERVICES.png' },
                { id: 7, name: 'Tool 7', src: '/assets/SERVICES.png' },
                { id: 8, name: 'Tool 8', src: '/assets/SERVICES.png' },
              ].map(tool => (
                <div key={`top-dup-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">SERVICES</h2>
        <div className="works__list reveal">
            <WorkItem
              title="UI/UX Design"
              category="Design & Prototype"
              num="01"
              isExpanded={expandedService === 1}
              onToggle={() => setExpandedService(expandedService === 1 ? null : 1)}
              details={[
                '• Website UI Design',
                '• Mobile App UI Design',
                '• Wireframing',
                '• Prototyping',
                '• Design Systems',
              ]}
            />
            <WorkItem
              title="Website Development"
              category="Development & Deployment"
              num="02"
              isExpanded={expandedService === 2}
              onToggle={() => setExpandedService(expandedService === 2 ? null : 2)}
              details={[
                '• WordPress Development',
                '• Shopify Development',
                '• Landing Pages',
                '• Business Websites',
                '• Portfolio Websites',
                '• Website Customization',
              ]}
            />
            <WorkItem
              title="Cloud & Infrastructure"
              category="Cloud Solutions"
              num="03"
              isExpanded={expandedService === 3}
              onToggle={() => setExpandedService(expandedService === 3 ? null : 3)}
              details={[
                '• Website Deployment',
                '• Domain & DNS Configuration',
                '• Cloud Hosting',
                '• SSL Setup',
                '• Website Migration',
                '• Performance Optimization',
              ]}
            />
            <WorkItem
              title="Technical Virtual Assistance"
              category="Support"
              num="04"
              isExpanded={expandedService === 4}
              onToggle={() => setExpandedService(expandedService === 4 ? null : 4)}
              details={[
                '• Website Maintenance',
                '• Content Management',
                '• Technical Support',
                '• Documentation',
                '• Basic Automation',
                '• Troubleshooting',
              ]}
            />
             <WorkItem
              title="E-commerce Virtual Assistance"
              category="E-commerce"
              num="05"
              isExpanded={expandedService === 5}
              onToggle={() => setExpandedService(expandedService === 5 ? null : 5)}
              details={[
                '• Shopify Store Management',
                '• Product Listing',
                '• Inventory Management',
                '• Order Processing',
                '• Customer Support',
                '• Store Optimization',
              ]}
            />
        </div>
        
        {/* Bottom Carousel Border */}
        <div className="tools-carousel overflow-hidden">
          <div className="tools-carousel__wrapper">
            <div className="tools-carousel__track">
              {[
                { id: 1, name: 'Tool 1', src: '/assets/SERVICES.png' },
                { id: 2, name: 'Tool 2', src: '/assets/SERVICES.png' },
                { id: 3, name: 'Tool 3', src: '/assets/SERVICES.png' },
                { id: 4, name: 'Tool 4', src: '/assets/SERVICES.png' },
                { id: 5, name: 'Tool 5', src: '/assets/SERVICES.png' },
                { id: 6, name: 'Tool 6', src: '/assets/SERVICES.png' },
                { id: 7, name: 'Tool 7', src: '/assets/SERVICES.png' },
                { id: 8, name: 'Tool 8', src: '/assets/SERVICES.png' },
              ].map(tool => (
                <div key={`btm-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="tools-carousel__track" aria-hidden="true">
              {[
                { id: 1, name: 'Tool 1', src: '/assets/SERVICES.png' },
                { id: 2, name: 'Tool 2', src: '/assets/SERVICES.png' },
                { id: 3, name: 'Tool 3', src: '/assets/SERVICES.png' },
                { id: 4, name: 'Tool 4', src: '/assets/SERVICES.png' },
                { id: 5, name: 'Tool 5', src: '/assets/SERVICES.png' },
                { id: 6, name: 'Tool 6', src: '/assets/SERVICES.png' },
                { id: 7, name: 'Tool 7', src: '/assets/SERVICES.png' },
                { id: 8, name: 'Tool 8', src: '/assets/SERVICES.png' },
              ].map(tool => (
                <div key={`btm-dup-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CREATIVE WORK / GALLERY SECTION */}
      <section id="Projects" className="gallery">
         <img 
            src="/assets/archive.png" 
            alt="Creative Work" 
            className="archive__image reveal w-[90%] md:w-[80%] lg:w-full" 
        />
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">Projects</h2>
        
        <div className="kinetic-gallery reveal">
          {/* Edge fades */}
          <div className="kinetic-gallery__fade kinetic-gallery__fade--left"></div>
          <div className="kinetic-gallery__fade kinetic-gallery__fade--right"></div>

          {/* Row 1 — scrolls left */}
          <div className="kinetic-row">
            <div className="kinetic-row__track kinetic-row__track--left">
              {[...Array(2)].map((_, dupeIdx) => (
                <React.Fragment key={`r1-${dupeIdx}`}>
                  {[
                    { id: 1, title: 'Brand Identity', desc: 'Visual identity & logo design', image: '/assets/contents.png' },
                    { id: 2, title: 'Dashboard UI', desc: 'Real-time analytics dashboard', image: '/assets/contents.png' },
                    { id: 3, title: 'E-Commerce Redesign', desc: 'Storefront conversion optimization', image: '/assets/contents.png' },
                    { id: 4, title: 'Mobile App', desc: 'Cross-platform fitness tracker', image: '/assets/contents.png' },
                    { id: 5, title: 'Landing Page', desc: 'High-converting SaaS page', image: '/assets/contents.png' },
                  ].map(p => (
                    <div key={`r1-${dupeIdx}-${p.id}`} className="kinetic-card" style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="kinetic-card__overlay"></div>
                      <div className="kinetic-card__number">{String(p.id).padStart(2, '0')}</div>
                      <div className="kinetic-card__content">
                        <h3 className="kinetic-card__title">{p.title}</h3>
                        <p className="kinetic-card__desc">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="kinetic-row">
            <div className="kinetic-row__track kinetic-row__track--right">
              {[...Array(2)].map((_, dupeIdx) => (
                <React.Fragment key={`r2-${dupeIdx}`}>
                  {[
                    { id: 6, title: 'Marketing Site', desc: 'Creative agency with animations', image: '/assets/contents.png' },
                    { id: 7, title: 'Portfolio Concept', desc: 'Minimal scroll-driven portfolio', image: '/assets/contents.png' },
                    { id: 8, title: 'Social Platform', desc: 'Community with real-time messaging', image: '/assets/contents.png' },
                    { id: 9, title: 'Startup Pitch Deck', desc: 'Investor presentation design', image: '/assets/contents.png' },
                    { id: 10, title: 'SaaS Dashboard', desc: 'Multi-tenant admin panel', image: '/assets/contents.png' },
                  ].map(p => (
                    <div key={`r2-${dupeIdx}-${p.id}`} className="kinetic-card" style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="kinetic-card__overlay"></div>
                      <div className="kinetic-card__number">{String(p.id).padStart(2, '0')}</div>
                      <div className="kinetic-card__content">
                        <h3 className="kinetic-card__title">{p.title}</h3>
                        <p className="kinetic-card__desc">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED TEXT SECTION */}
      <section style={{ padding: 'clamp(6rem, 10vh, 8rem) 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatedTextGenerate
          text="Have a project in mind? Let's build something great together."
          className="max-w-5xl"
          textClassName=""
          speed={1.2}
          highlightWords={['great', 'together.']}
          highlightClassName="text-blue-400"
        />
      </section>

      {/* 6. CONTACT SECTION (With Form) */}
      <section id="contact" className="contact">
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">CONTACT</h2>
        
        <div className="contact-container grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 xl:gap-20 px-4 md:px-8 lg:px-(--gutter) reveal">
            {/* Left Side: The Form */}
            <div className="contact-form-wrapper">
                <h3 className="form-header text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10">LET'S START A PROJECT</h3>
                
                {formState === 'success' ? (
                    <div className="form-success">
                        <p className="success-message text-lg sm:text-xl md:text-2xl">Message received. I'll get back to you shortly.</p>
                        <button onClick={() => setFormState('idle')} className="reset-btn text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Send another</button>
                    </div>
                ) : (
                    <form className="contact-form flex flex-col gap-6 md:gap-8" onSubmit={handleSubmit}>
                        <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div className="form-group">
                                <input type="text" id="name" required placeholder=" " className="form-input text-base sm:text-lg" />
                                <label htmlFor="name" className="form-label text-sm sm:text-base">Name</label>
                            </div>
                            <div className="form-group">
                                <input type="email" id="email" required placeholder=" " className="form-input text-base sm:text-lg" />
                                <label htmlFor="email" className="form-label text-sm sm:text-base">Email</label>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <input type="text" id="service" placeholder=" " className="form-input text-base sm:text-lg" />
                            <label htmlFor="service" className="form-label text-sm sm:text-base">What service are you interested in?</label>
                        </div>

                        <div className="form-group">
                            <textarea id="message" required placeholder=" " rows="1" className="form-input form-textarea text-base sm:text-lg"></textarea>
                            <label htmlFor="message" className="form-label text-sm sm:text-base">Tell me about your project</label>
                        </div>

                        <button type="submit" className="form-submit text-base sm:text-lg md:text-xl" disabled={formState === 'submitting'}>
                            {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                            <span className="arrow">↗</span>
                        </button>
                    </form>
                )}
            </div>

            {/* Right Side: Contact Details */}
            <div className="contact-details mt-8 lg:mt-0">
                <h3 className="details-header text-xs sm:text-sm">CONTACT DETAILS</h3>
                <div className="details-list">
                    <ContactItem label="Email" value="VA.DEASISGABRIEL@GMAIL.COM" href="mailto:va.deasisgabriel@gmail.com" />
                    <ContactItem label="GitHub" value="@GABRIELDEASIS21" href="https://github.com/gabrieldeasis21" />
                    <ContactItem label="LinkedIn" value="GABRIEL DE ASIS" href="#" />
                    <ContactItem label="Upwork" value="GABRIEL DE ASIS" href="#" />
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer reveal flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:py-8 px-4 md:px-8 lg:px-(--gutter)">
        <a href="#" className="footer__logo text-xs sm:text-sm">GDA© all rights reserved</a>
        <p className="footer__year text-xs sm:text-sm">2026</p>
      </footer>

    </div>
  )
}

// --- 3. HELPER COMPONENTS ---
const WorkItem = ({ title, category, isExpanded, onToggle, details = [] }) => (
  <article className="work-item">
    <motion.div
      className="overflow-hidden cursor-pointer select-none"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-8 sm:py-10 md:py-12 lg:py-16 group" style={{ padding: '2rem var(--gutter)' }}>
        <div className="min-w-0 flex-1">
          <h3 className="work-item__title">{title}</h3>
          <p className="work-item__category">{category}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 ml-4 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors duration-500"
          style={{
            background: isExpanded ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/40" />
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/40" />
          </svg>
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 sm:pb-12 md:pb-16 pt-2" style={{ paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
              <div className="flex flex-col gap-1">
                {details.map((detail, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="group/detail"
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl text-white/50 group-hover/detail:text-white/90 transition-colors duration-500 font-light tracking-tight leading-relaxed">
                      {detail}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </article>
)

const TimelineItem = ({ year, title, place }) => (
  <div className="timeline__item flex flex-col gap-1">
    <span className="timeline__year text-xs sm:text-sm">{year}</span>
    <p className="timeline__title text-base sm:text-lg md:text-xl">{title}</p>
    <p className="timeline__place text-xs sm:text-sm">{place}</p>
  </div>
)

const ContactItem = ({ label, value, href }) => (
  <a href={href} className="contact__item py-4 sm:py-6 md:py-8" target="_blank" rel="noreferrer">
    <span className="contact__label text-xs sm:text-sm">{label}: </span>
    <span className="contact__value text-base sm:text-lg md:text-xl lg:text-2xl">{value}</span>
  </a>
)

// --- 4. 3D BADGE COMPONENT ---
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef()
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  
  const { nodes, materials } = useGLTF('/assets/tag.glb')
  
  const stringTexture = useTexture('/assets/string.png')
  const profileTexture = useTexture('/assets/my-badge-photo.png')
  
  // Clone and configure textures to avoid modifying hook return values
  const texture = useMemo(() => {
    const cloned = stringTexture.clone()
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping
    cloned.needsUpdate = true
    return cloned
  }, [stringTexture])
  
  const myProfilePic = useMemo(() => {
    const cloned = profileTexture.clone()
    cloned.flipY = false
    cloned.needsUpdate = true
    return cloned
  }, [profileTexture]) 
  
  const { width, height } = useThree((state) => state.viewport)
  
  const isMobile = width < 7;
  const xPos = isMobile ? 0 : width / 2.8; 
  const yPos = isMobile ? 5 : 4;

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.2])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.2])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.2])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useEffect(() => {
    if (fixed.current) {
        fixed.current.setTranslation({ x: xPos, y: yPos, z: 0 })
        j1.current.setTranslation({ x: xPos, y: yPos, z: 0 })
        j2.current.setTranslation({ x: xPos, y: yPos, z: 0 })
        j3.current.setTranslation({ x: xPos, y: yPos, z: 0 })
        card.current.setTranslation({ x: xPos, y: yPos, z: 0 })
        
        fixed.current.wakeUp()
        j1.current.wakeUp()
        j2.current.wakeUp()
        j3.current.wakeUp()
        card.current.wakeUp()
    }
  }, [width, height, xPos, yPos])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    
    if (fixed.current && j1.current && j2.current && j3.current && band.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      
      band.current.geometry.setPoints(curve.getPoints(32))
      
      if (card.current) {
        ang.copy(card.current.angvel())
        rot.copy(card.current.rotation())
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
      }
    }
  })

  const resolution = useMemo(() => new THREE.Vector2(width, height), [width, height])

  return (
    <>
      <group>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial 
                map={myProfilePic} 
                map-anisotropy={20} 
                clearcoat={1} 
                clearcoatRoughness={0.100} 
                iridescence={3}
                iridescenceIOR={0.8}
                iridescenceThicknessRange={[0, 2500]}
                roughness={1} 
                metalness={1.25} 
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry points={curve.getPoints(32)} />
        <meshLineMaterial 
            transparent 
            color="white" 
            depthTest={false} 
            resolution={resolution} 
            useMap 
            map={texture} 
            repeat={[-3, 1]} 
            lineWidth={0.5} 
        />
      </mesh>
    </>
  )
}