import * as THREE from 'three'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

// --- STATIC DATA ---
const PLACEHOLDER_IMAGE = '/assets/contents.png'

const CAROUSEL_TOOLS = [
  { id: 1, name: 'Tool 1', src: '/assets/SERVICES.png' },
  { id: 2, name: 'Tool 2', src: '/assets/SERVICES.png' },
  { id: 3, name: 'Tool 3', src: '/assets/SERVICES.png' },
  { id: 4, name: 'Tool 4', src: '/assets/SERVICES.png' },
  { id: 5, name: 'Tool 5', src: '/assets/SERVICES.png' },
  { id: 6, name: 'Tool 6', src: '/assets/SERVICES.png' },
  { id: 7, name: 'Tool 7', src: '/assets/SERVICES.png' },
  { id: 8, name: 'Tool 8', src: '/assets/SERVICES.png' },
]

// Unified project data — tags and richer desc shown in the lightbox
const GALLERY_PROJECTS = [
  {
    id: 1,
    title: 'Brand Identity',
    desc: 'Visual identity & logo design for a boutique lifestyle brand. Covers wordmark, colour system, and brand guidelines.',
    tags: ['Branding', 'Figma'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    title: 'Dashboard UI',
    desc: 'Real-time analytics dashboard with configurable widgets, dark/light modes, and accessibility-first components.',
    tags: ['React', 'UI/UX'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 3,
    title: 'E-Commerce Redesign',
    desc: 'Storefront conversion-rate optimisation — restructured navigation, streamlined checkout, and a new product card system.',
    tags: ['Shopify', 'CRO'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 4,
    title: 'Mobile App',
    desc: 'Cross-platform fitness tracker with activity logging, progress charts, and social sharing. Built with React Native.',
    tags: ['React Native', 'Health'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 5,
    title: 'Landing Page',
    desc: 'High-converting SaaS landing page with scroll-based animations, feature breakdown, and integrated demo request form.',
    tags: ['Next.js', 'GSAP'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 6,
    title: 'Marketing Site',
    desc: 'Creative agency site with canvas-based particle background, parallax sections, and award-winning scroll experience.',
    tags: ['Three.js', 'GSAP'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 7,
    title: 'Portfolio Concept',
    desc: 'Minimal scroll-driven developer portfolio with custom cursor, magnetic buttons, and smooth page transitions.',
    tags: ['Next.js', 'Framer Motion'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 8,
    title: 'Social Platform',
    desc: 'Community platform with real-time messaging, threaded comments, notification feed, and granular privacy controls.',
    tags: ['React', 'Firebase'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 9,
    title: 'Startup Pitch Deck',
    desc: 'Investor presentation design system — slide templates, data visualisations, and interactive prototype for demo day.',
    tags: ['Figma', 'Motion'],
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 10,
    title: 'SaaS Dashboard',
    desc: 'Multi-tenant admin panel with role-based access, audit logs, billing management, and a fully custom component library.',
    tags: ['React', 'TypeScript'],
    image: PLACEHOLDER_IMAGE,
  },
]

const CERTIFICATIONS = [
  {
    id: 1,
    issuer: 'Meta',
    name: 'Meta Front-End Developer Professional Certificate',
    year: '2024',
    platform: 'Coursera',
    image: '/assets/cert-meta.png',
    href: '#',
  },
  {
    id: 2,
    issuer: 'Google',
    name: 'Google UX Design Professional Certificate',
    year: '2024',
    platform: 'Coursera',
    image: '/assets/cert-google.png',
    href: '#',
  },
  {
    id: 3,
    issuer: 'AWS',
    name: 'AWS Cloud Practitioner Essentials',
    year: '2023',
    platform: 'Amazon',
    image: '/assets/cert-aws.png',
    href: '#',
  },
  {
    id: 4,
    issuer: 'freeCodeCamp',
    name: 'Responsive Web Design Certification',
    year: '2023',
    platform: 'fCC',
    image: '/assets/cert-fcc.png',
    href: '#',
  },
  {
    id: 5,
    issuer: 'Figma',
    name: 'Figma Professional UI Design',
    year: '2024',
    platform: 'Figma',
    image: '/assets/cert-figma.png',
    href: '#',
  },
  {
    id: 6,
    issuer: 'Shopify',
    name: 'Shopify Partner & Store Management',
    year: '2025',
    platform: 'Shopify',
    image: '/assets/cert-shopify.png',
    href: '#',
  },
]



const GALLERY_ROW_1 = GALLERY_PROJECTS.slice(0, 5)
const GALLERY_ROW_2 = GALLERY_PROJECTS.slice(5, 10)

// ---------------------------------------------------------------------------
//  ProjectLightbox — resolution-agnostic image viewer with zoom + pan
// ---------------------------------------------------------------------------
function ProjectLightbox({ project, onClose }) {
  const MIN_ZOOM = 1
  const MAX_ZOOM = 4

  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef(null)
  const imgRef = useRef(null)

  // Clamp pan so the image never scrolls fully off-screen
  const clampOffset = useCallback((ox, oy, z) => {
    if (!imgRef.current) return { x: ox, y: oy }
    const el = imgRef.current
    const maxX = Math.max(0, (el.offsetWidth  * (z - 1)) / 2)
    const maxY = Math.max(0, (el.offsetHeight * (z - 1)) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    }
  }, [])

  // Scroll to zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.25 : 0.25
    setZoom((z) => {
      const next = parseFloat(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)).toFixed(2))
      if (next <= MIN_ZOOM) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  // Pointer drag to pan
  const handlePointerDown = useCallback((e) => {
    if (zoom <= MIN_ZOOM) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsPanning(true)
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
  }, [zoom, offset])

  const handlePointerMove = useCallback((e) => {
    if (!isPanning || !panStart.current) return
    const raw = { x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }
    setOffset(clampOffset(raw.x, raw.y, zoom))
  }, [isPanning, zoom, clampOffset])

  const handlePointerUp = useCallback(() => {
    setIsPanning(false)
    panStart.current = null
  }, [])

  // Double-click toggles between 1× and 2.5×
  const handleDoubleClick = useCallback(() => {
    if (zoom > MIN_ZOOM) {
      setZoom(MIN_ZOOM)
      setOffset({ x: 0, y: 0 })
    } else {
      setZoom(2.5)
    }
  }, [zoom])

  // Toolbar zoom buttons
  const zoomIn  = () => setZoom((z) => parseFloat(Math.min(MAX_ZOOM, z + 0.5).toFixed(1)))
  const zoomOut = () => setZoom((z) => {
    const next = parseFloat(Math.max(MIN_ZOOM, z - 0.5).toFixed(1))
    if (next <= MIN_ZOOM) setOffset({ x: 0, y: 0 })
    return next
  })
  const zoomReset = () => { setZoom(MIN_ZOOM); setOffset({ x: 0, y: 0 }) }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ padding: 'clamp(0.75rem, 3vw, 2rem)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      />

      {/* Dialog */}
      <motion.div
        className="relative flex flex-col w-full"
        style={{
          maxWidth: '1000px',
          maxHeight: 'calc(100svh - clamp(1.5rem, 6vw, 4rem))',
          background: '#0d0d10',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '18px',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} — project detail`}
      >
        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.625rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ZoomBtn onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </ZoomBtn>

            <ZoomBtn
              onClick={zoomReset}
              aria-label={`Reset zoom — currently ${Math.round(zoom * 100)}%`}
              style={{ minWidth: '52px', fontSize: '12px', letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}
            >
              {Math.round(zoom * 100)}%
            </ZoomBtn>

            <ZoomBtn onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </ZoomBtn>

            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginLeft: '8px', whiteSpace: 'nowrap' }}
                  className="hidden sm:inline">
              Scroll to zoom · double-click to toggle
            </span>
          </div>

          {/* Close */}
          <CloseBtn onClick={onClose} />
        </div>

        {/* ── Image viewer ────────────────────────────────────────── */}
        {/*
          height is clamped so the info panel below is always visible.
          objectFit: contain keeps the FULL image visible regardless of its
          aspect ratio — portrait, landscape, square, or anything else.
          The user can scroll to zoom and drag to pan when zoomed in.
        */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            height: 'clamp(200px, 55vh, 620px)',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.6)',
            cursor: zoom > MIN_ZOOM ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
            userSelect: 'none',
            touchAction: 'none',
          }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
        >
          <img
            ref={imgRef}
            src={project.image || PLACEHOLDER_IMAGE}
            alt={project.title}
            draggable={false}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE
            }}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',       // always fully visible, no cropping
              objectPosition: 'center',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── Info panel ──────────────────────────────────────────── */}
        <div style={{
          padding: 'clamp(0.875rem, 2.5vw, 1.375rem) clamp(1rem, 3vw, 1.75rem)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Left: id + title + desc */}
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <span style={{
              display: 'block',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '4px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(project.id).padStart(2, '0')}
            </span>

            <h3 style={{
              margin: 0,
              fontSize: 'clamp(1.125rem, 2.6vw, 1.625rem)',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1.15,
            }}>
              {project.title}
            </h3>

            <p style={{
              margin: '0.4rem 0 0',
              fontSize: 'clamp(0.78rem, 1.3vw, 0.875rem)',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.65,
              maxWidth: '58ch',
            }}>
              {project.desc}
            </p>
          </div>

          {/* Right: tags */}
          {project.tags?.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              justifyContent: 'flex-end',
              flexShrink: 0,
              maxWidth: '160px',
            }}>
              {project.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.36)',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Toolbar button primitives
const ZOOM_BTN_BASE = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '28px', minWidth: '28px', padding: '0 7px',
  borderRadius: '7px',
  border: '1px solid rgba(255,255,255,0.08)',
  transition: 'background 0.15s, color 0.15s',
  flexShrink: 0,
  cursor: 'pointer',
}

function ZoomBtn({ children, disabled, style, ...rest }) {
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        ...ZOOM_BTN_BASE,
        background: disabled ? 'transparent' : 'rgba(255,255,255,0.05)',
        color: disabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function CloseBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '28px', height: '28px', borderRadius: '50%',
        background: hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: hov ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

// ---------------------------------------------------------------------------
//  KineticCard — uses <img objectFit:cover> instead of backgroundImage so
//  any image resolution (portrait/landscape/square) fills the card correctly.
// ---------------------------------------------------------------------------
function KineticCard({ p, onOpen }) {
  return (
    <div
      className="kinetic-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${p.title}`}
      onClick={() => onOpen(p)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p) }
      }}
    >
      {/* Resolution-agnostic cover image */}
      <img
        src={p.image || PLACEHOLDER_IMAGE}
        alt=""
        aria-hidden="true"
        draggable={false}
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <div className="kinetic-card__overlay" />
      <div className="kinetic-card__number">{String(p.id).padStart(2, '0')}</div>
      <div className="kinetic-card__content">
        <h3 className="kinetic-card__title">{p.title}</h3>
        <p className="kinetic-card__desc">{p.desc}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
//  App
// ---------------------------------------------------------------------------
export default function App() {
  const [expandedService, setExpandedService] = useState(null)
  const [expandedProject, setExpandedProject] = useState(null)

  // --- FORM LOGIC ---
  const [formState, setFormState] = useState('idle') // 'idle' | 'submitting' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormState('submitting')
    setTimeout(() => setFormState('success'), 1500)
  }

  // --- SCROLL REVEAL ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // --- LIGHTBOX: Escape key + scroll lock ---
  useEffect(() => {
    if (!expandedProject) return
    const handleKeyDown = (e) => { if (e.key === 'Escape') setExpandedProject(null) }
    window.addEventListener('keydown', handleKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [expandedProject])

  return (
    <div className="app-container">

      {/* NAV */}
      <nav className="nav">
        {[
          ['#intro', 'Intro'],
          ['#about', 'About'],
          ['#services', 'Services'],
          ['#certifications', 'Certificates'],
          ['#projects', 'Projects'],
          ['#contact', 'Contact'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="nav__link"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* 1. HERO */}
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
                <Lightformer intensity={2}  color="white" position={[0, -1, 5]}    rotation={[0, 0, Math.PI / 3]}         scale={[100, 0.1, 1]}  />
                <Lightformer intensity={3}  color="white" position={[-1, -1, 1]}   rotation={[0, 0, Math.PI / 3]}         scale={[100, 0.1, 1]}  />
                <Lightformer intensity={3}  color="white" position={[1, 1, 1]}     rotation={[0, 0, Math.PI / 3]}         scale={[100, 0.1, 1]}  />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]}  rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
              </Environment>
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      </section>

      {/* 2. CONTENTS */}
      <section id="contents" className="contents-section reveal">
        <div className="contents-container">
          <img src="/assets/contents.png" alt="Table of Contents" className="contents-image" />
          <div className="contents-overlay absolute top-1/2 md:top-[60%] left-4 sm:left-6 md:left-[8%] -translate-y-1/2 z-10 max-w-[90%]">
            <nav className="array-nav flex flex-col gap-3 sm:gap-4 md:gap-6 items-start">
              {[
                ['#about',         '<1>', 'ABOUT ME'],
                ['#services',      '<2>', 'SERVICES'],
                ['#creative-work', '<3>', 'CREATIVE WORK'],
                ['#contact',       '<4>', 'CONTACT'],
              ].map(([href, idx, label]) => (
                <a key={href} href={href} className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                  <span className="array-index">{idx}</span> {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* 3. ABOUT */}
      <section id="about" className="about" style={{ padding: 'clamp(6rem, 10vh, 8rem) 0' }}>
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)] mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-(--gutter)">
          ABOUT ME
        </h2>
        <div className="about__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_1.5fr_1fr_1fr] items-start gap-10 lg:gap-14 xl:gap-18 px-4 md:px-8 lg:px-(--gutter)">
          <div className="reveal flex items-start justify-center md:col-span-2 lg:col-span-1 lg:row-span-1 lg:sticky lg:top-32">
            <ProfileCard
              img="/assets/222211.jpg"
              name="Gabriel De Asis"
              position="Software, Cloud, and UI/UX Specialist"
              bio="Specialized in building modern web applications, intuitive user interfaces, and cloud-based solutions that help businesses streamline workflows, strengthen their online presence, and achieve their goals."
              spotlight
              spotlightColor="59,130,246"
              skills={[
                { name: 'React',      icon: Globe },
                { name: 'JavaScript', icon: Globe },
                { name: 'UI/UX',      icon: Globe },
                { name: 'Branding',   icon: Globe },
              ]}
              socialLinks={[
                { name: 'GitHub',   url: 'https://github.com/gabrieldeasis21',            icon: Github   },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/deasisgabriel',     icon: Linkedin },
              ]}
            />
          </div>

          <div className="about__column about__column--bio reveal md:col-span-2 lg:col-span-1">
            <h3 className="about__label">HI I'M</h3>
            <div className="about__name-large text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">
              <span>Gabriel</span>
              <span>De Asis</span>
            </div>
            <ScrollReveal baseOpacity={0.1} enableBlur baseRotation={2} blurStrength={3}
              containerClassName="about__scroll-reveal" textClassName="about__text text-sm sm:text-base md:text-lg">
              Your technology partner for building modern digital solutions, from intuitive user experiences to scalable web applications and cloud-based systems.
            </ScrollReveal>
            <ScrollReveal baseOpacity={0.1} enableBlur baseRotation={2} blurStrength={3}
              containerClassName="about__scroll-reveal" textClassName="about__text text-sm sm:text-base md:text-lg">
              I combine software engineering, cloud technologies, UI/UX design, and technical virtual assistance to create solutions that improve workflows, strengthen your online presence, and support business growth.
            </ScrollReveal>
          </div>

          <div className="about__column about__column--education reveal">
            <h3 className="about__label">EDUCATIONAL BACKGROUND</h3>
            <div className="timeline">
              <TimelineItem year="2023 - Present" title="Bachelor Of Science in Computer Science" place="Cavite State University" />
              <TimelineItem year="2020 - 2023"   title="Science, Technology, Engineering, and Mathematics" place="National College of Science & Technology" />
            </div>
          </div>

          <div className="about__column about__column--career reveal">
            <h3 className="about__label">EXPERIENCE</h3>
            <div className="timeline">
              <TimelineItem year="2026 - Present" title="Full-Stack Developer"   place="CvSU Research Extension" />
              <TimelineItem year="2024 - 2025"    title="UI/UX Designer"         place="Remote"   />
              <TimelineItem year="2023 - 2024"    title="Social Media Manager"   place="Kaffatea" />
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 TOOLS */}
      <ToolsSection />

      {/* 4. SERVICES */}
      <section id="services" className="works">
        <Carousel reverse />

        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">SERVICES</h2>

        <div className="works__list reveal">
          {[
            { id: 1, title: 'UI/UX Design',                  category: 'Design & Prototype',      details: ['• Website UI Design','• Mobile App UI Design','• Wireframing','• Prototyping','• Design Systems'] },
            { id: 2, title: 'Website Development',           category: 'Development & Deployment', details: ['• WordPress Development','• Shopify Development','• Landing Pages','• Business Websites','• Portfolio Websites','• Website Customization'] },
            { id: 3, title: 'Cloud & Infrastructure',        category: 'Cloud Solutions',          details: ['• Website Deployment','• Domain & DNS Configuration','• Cloud Hosting','• SSL Setup','• Website Migration','• Performance Optimization'] },
            { id: 4, title: 'Technical Virtual Assistance',  category: 'Support',                  details: ['• Website Maintenance','• Content Management','• Technical Support','• Documentation','• Basic Automation','• Troubleshooting'] },
            { id: 5, title: 'E-commerce Virtual Assistance', category: 'E-commerce',               details: ['• Shopify Store Management','• Product Listing','• Inventory Management','• Order Processing','• Customer Support','• Store Optimization'] },
          ].map(({ id, title, category, details }) => (
            <WorkItem
              key={id}
              title={title}
              category={category}
              num={String(id).padStart(2, '0')}
              isExpanded={expandedService === id}
              onToggle={() => setExpandedService(expandedService === id ? null : id)}
              details={details}
            />
          ))}
        </div>

        <Carousel />
      </section>

    {/* 4.5 CERTIFICATIONS */}
<section id="certifications" className="certifications">
  <div className="certs-header reveal px-4 md:px-8 lg:px-(--gutter)">
    <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">
      CERTIFICATIONS
    </h2>
    <p className="certs-subtitle">Credentials &amp; Achievements</p>
  </div>

  <div className="cert-grid reveal px-4 md:px-8 lg:px-(--gutter)">
    {CERTIFICATIONS.map(({ id, issuer, name, year, platform, image, href }) => (
      <a
        key={id}
        href={href || '#'}
        target="_blank"
        rel="noreferrer"
        className="cert-card"
        aria-label={`${name} — ${issuer}, ${year}`}
      >
        <div className="cert-img-wrap">
          {image ? (
            <img
              src={image}
              alt={`${name} certificate`}
              className="cert-img"
              draggable={false}
            />
          ) : (
            <div className="cert-img-placeholder">
              <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="6" width="28" height="22" rx="2" stroke="white" strokeWidth="1.4"/>
                <path d="M11 28l3-4 4 5 4-3 3 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="13" cy="14" r="2.5" stroke="white" strokeWidth="1.4"/>
              </svg>
              <span>certificate image</span>
            </div>
          )}
          <div className="cert-overlay" />
        </div>

        <div className="cert-info">
          <div className="cert-top">
            <div className="cert-issuer-row">
              <span className="cert-dot" />
              <span className="cert-issuer">{issuer}</span>
            </div>
            <span className="cert-num">{String(id).padStart(2, '0')}</span>
          </div>
          <p className="cert-name">{name}</p>
          <div className="cert-divider" />
          <div className="cert-footer">
            <div className="cert-meta">
              <span className="cert-year">{year}</span>
              <span className="cert-sep">·</span>
              <span className="cert-badge">{platform}</span>
            </div>
            <span className="cert-arrow">↗</span>
          </div>
        </div>
      </a>
    ))}
  </div>
</section>  

      {/* 5. CREATIVE WORK / GALLERY */}
      <section id="projects" className="gallery">
        <img src="/assets/archive.png" alt="Creative Work"
          className="archive__image reveal w-[90%] md:w-[80%] lg:w-full" />
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">Projects</h2>

        <div className="kinetic-gallery reveal">
          <div className="kinetic-gallery__fade kinetic-gallery__fade--left" />
          <div className="kinetic-gallery__fade kinetic-gallery__fade--right" />

          {/* Row 1 — left */}
          <div className="kinetic-row">
            <div
              className="kinetic-row__track kinetic-row__track--left"
              style={{ animationPlayState: expandedProject ? 'paused' : 'running' }}
            >
              {[0, 1].map((di) => (
                <React.Fragment key={`r1-${di}`}>
                  {GALLERY_ROW_1.map(p => (
                    <KineticCard key={`r1-${di}-${p.id}`} p={p} onOpen={setExpandedProject} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Row 2 — right */}
          <div className="kinetic-row">
            <div
              className="kinetic-row__track kinetic-row__track--right"
              style={{ animationPlayState: expandedProject ? 'paused' : 'running' }}
            >
              {[0, 1].map((di) => (
                <React.Fragment key={`r2-${di}`}>
                  {GALLERY_ROW_2.map(p => (
                    <KineticCard key={`r2-${di}-${p.id}`} p={p} onOpen={setExpandedProject} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED TEXT */}
      <section style={{ padding: 'clamp(6rem, 10vh, 8rem) 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatedTextGenerate
          text="Have a project in mind? Let's build something great together."
          className="max-w-5xl"
          speed={1.2}
          highlightWords={['great', 'together.']}
          highlightClassName="text-blue-400"
        />
      </section>

      {/* 6. CONTACT */}
      <section id="contact" className="contact">
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">CONTACT</h2>

        <div className="contact-container grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 xl:gap-20 px-4 md:px-8 lg:px-(--gutter) reveal">
          <div className="contact-form-wrapper">
            <h3 className="form-header text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10">LET'S START A PROJECT</h3>

            {formState === 'success' ? (
              <div className="form-success">
                <p className="success-message text-lg sm:text-xl md:text-2xl">Message received. I'll get back to you shortly.</p>
                <button onClick={() => setFormState('idle')} className="reset-btn text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact-form flex flex-col gap-6 md:gap-8" onSubmit={handleSubmit}>
                <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="form-group">
                    <input type="text"  id="name"  required placeholder=" " className="form-input text-base sm:text-lg" />
                    <label htmlFor="name"  className="form-label text-sm sm:text-base">Name</label>
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
                  <textarea id="message" required placeholder=" " rows="1" className="form-input form-textarea text-base sm:text-lg" />
                  <label htmlFor="message" className="form-label text-sm sm:text-base">Tell me about your project</label>
                </div>
                <button type="submit" className="form-submit text-base sm:text-lg md:text-xl" disabled={formState === 'submitting'}>
                  {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                  <span className="arrow">↗</span>
                </button>
              </form>
            )}
          </div>

          <div className="contact-details mt-8 lg:mt-0">
            <h3 className="details-header text-xs sm:text-sm">CONTACT DETAILS</h3>
            <div className="details-list">
              <ContactItem label="Email"    value="VA.DEASISGABRIEL@GMAIL.COM"  href="mailto:va.deasisgabriel@gmail.com" />
              <ContactItem label="GitHub"   value="@GABRIELDEASIS21"            href="https://github.com/gabrieldeasis21" />
              <ContactItem label="LinkedIn" value="GABRIEL DE ASIS"             href="#" />
              <ContactItem label="Upwork"   value="GABRIEL DE ASIS"             href="#" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer reveal flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:py-8 px-4 md:px-8 lg:px-(--gutter)">
        <a href="#" className="footer__logo text-xs sm:text-sm">GDA© all rights reserved</a>
        <p className="footer__year text-xs sm:text-sm">2026</p>
      </footer>

      {/* PROJECT LIGHTBOX
          Kept at root level so `fixed` positioning is never clipped by
          an ancestor's overflow or transform.  */}
      <AnimatePresence>
        {expandedProject && (
          <ProjectLightbox
            project={expandedProject}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

// ---------------------------------------------------------------------------
//  Small shared helpers
// ---------------------------------------------------------------------------

/** Services carousel strip — used above and below the Services list */
function Carousel({ reverse = false }) {
  return (
    <div className="tools-carousel overflow-hidden">
      <div className={`tools-carousel__wrapper ${reverse ? 'tools-carousel__wrapper--reverse' : ''}`}>
        {[0, 1].map((di) => (
          <div key={di} className="tools-carousel__track" aria-hidden={di === 1 ? 'true' : undefined}>
            {CAROUSEL_TOOLS.map(tool => (
              <div key={`${di}-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const WorkItem = ({ title, category, isExpanded, onToggle, details = [] }) => (
  <article className="work-item">
    <motion.div
      className="overflow-hidden cursor-pointer select-none"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle() }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      <div className="flex items-center justify-between group" style={{ padding: '2rem var(--gutter)' }}>
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
            <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>

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

// ---------------------------------------------------------------------------
//  3D Badge
// ---------------------------------------------------------------------------
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef()
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }

  const { nodes, materials } = useGLTF('/assets/tag.glb')
  const stringTexture  = useTexture('/assets/string.png')
  const profileTexture = useTexture('/assets/my-badge-photo.png')

  const texture = useMemo(() => {
    const c = stringTexture.clone()
    c.wrapS = c.wrapT = THREE.RepeatWrapping
    c.needsUpdate = true
    return c
  }, [stringTexture])

  const myProfilePic = useMemo(() => {
    const c = profileTexture.clone()
    c.flipY = false
    c.needsUpdate = true
    return c
  }, [profileTexture])

  const { width, height } = useThree((state) => state.viewport)
  const isMobile = width < 7
  const xPos = isMobile ? 0 : width / 2.8
  const yPos = isMobile ? 5 : 4

  const [curve]    = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0,0,0],[0,0,0],1.2])
  useRopeJoint(j1,   j2, [[0,0,0],[0,0,0],1.2])
  useRopeJoint(j2,   j3, [[0,0,0],[0,0,0],1.2])
  useSphericalJoint(j3, card, [[0,0,0],[0,1.45,0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useEffect(() => {
    if (!fixed.current) return
    ;[fixed, j1, j2, j3, card].forEach(r => {
      r.current.setTranslation({ x: xPos, y: yPos, z: 0 })
      r.current.wakeUp()
    })
  }, [width, height, xPos, yPos])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(r => r.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && j1.current && j2.current && j3.current && band.current) {
      ;[j1, j2].forEach(r => {
        if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation())
        const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())))
        r.current.lerped.lerp(r.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)))
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
        <RigidBody position={[0,0,0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0,0,0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0,0,0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0,0,0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={myProfilePic}
                map-anisotropy={20}
                clearcoat={1}
                clearcoatRoughness={0.1}
                iridescence={3}
                iridescenceIOR={0.8}
                iridescenceThicknessRange={[0, 2500]}
                roughness={1}
                metalness={1.25}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}  material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry points={curve.getPoints(32)} />
        <meshLineMaterial
          transparent color="white" depthTest={false}
          resolution={resolution} useMap map={texture}
          repeat={[-3, 1]} lineWidth={0.5}
        />
      </mesh>
    </>
  )
}