import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

// --- 1. SETUP & PRELOADS ---
extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/assets/tag.glb')
useTexture.preload('/assets/string.png')
useTexture.preload('/assets/my-badge-photo.png')

// --- 2. MAIN APP COMPONENT ---
export default function App() {

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
      <nav className="nav hidden sm:flex">
        <a href="#intro" className="nav__link">INTRO</a>
        <a href="#about" className="nav__link">ABOUT ME</a>
        <a href="#services" className="nav__link">SERVICES</a>
        <a href="#archives" className="nav__link">ARCHIVES</a>
        <a href="#contact" className="nav__link">CONTACT</a>
      </nav>

      {/* Mobile Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-999 flex sm:hidden gap-2 bg-[rgba(12,12,12,0.7)] backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-lg overflow-x-auto max-w-[92vw] scrollbar-hide">
        <a href="#about" className="nav__link whitespace-nowrap text-xs">ABOUT</a>
        <a href="#services" className="nav__link whitespace-nowrap text-xs">SERVICES</a>
        <a href="#archives" className="nav__link whitespace-nowrap text-xs">ARCHIVES</a>
        <a href="#contact" className="nav__link whitespace-nowrap text-xs">CONTACT</a>
      </nav>

      {/* 1. INTRO / HERO SECTION */}
      <section id="intro" className="hero min-h-screen w-full">
        <img 
            src="/assets/portfolio_text.png" 
            alt="Gabriel De Asis" 
            className="hero__logo w-[95%] sm:w-[90%] md:w-[85%] max-w-500"
        />
        <div className="badge-container">
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
                    <a href="#archives" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<3>'}</span> ARCHIVES
                    </a>
                    <a href="#contact" className="array-link text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.5rem,4vw,3.5rem)]">
                        <span className="array-index">{'<4>'}</span> CONTACT
                    </a>
                </nav>
            </div>
         </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="about py-16 sm:py-20 md:py-24 lg:py-32">
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)] mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-(--gutter)">ABOUT ME</h2>
        <div className="about__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-8 lg:gap-12 xl:gap-16 px-4 md:px-8 lg:px-(--gutter)">
            <div className="about__column about__column--bio reveal md:col-span-2 lg:col-span-1">
                <h3 className="about__label">HI I'M</h3>
                <div className="about__name-large text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">
                    <span>Gabriel</span>
                    <span>De Asis</span>
                </div>
                <p className="about__text text-sm sm:text-base md:text-lg">
                    Your Digital Transformation Partner, specialized in optimizing business processes and enhancing online presence.
                </p>
                <p className="about__text text-sm sm:text-base md:text-lg">
                    My approach combines technical expertise with business acumen to deliver solutions that drive real results.
                </p>
            </div>

            <div className="about__column about__column--education reveal">
                <h3 className="about__label">EDUCATIONAL BACKGROUND</h3>
                <div className="timeline">
                    <TimelineItem year="2023-2027" title="BS Computer Science" place="Cavite State University" />
                    <TimelineItem year="2020-2023" title="STEM" place="National College of Science" />
                </div>
            </div>

            <div className="about__column about__column--career reveal">
                <h3 className="about__label">EXPERIENCE</h3>
                <div className="timeline">
                    <TimelineItem year="2024-NOW" title="Freelance Consultant" place="REMOTE" />
                    <TimelineItem year="2023-2024" title="System Administrator" place="TECH STARTUP" />
                    <TimelineItem year="2022-2023" title="Digital Marketing Specialist" place="AGENCY" />
                </div>
            </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="works">
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">SERVICES</h2>
        <div className="works__list reveal">
            <WorkItem title="Website Funnel Builder" category="Website building, CRM integration" num="01" />
            <WorkItem title="General Virtual Assistant" category="Administrative support" num="02" />
            <WorkItem title="Social Media Manager" category="Strategy & Content" num="03" />
        </div>
        
        {/* Tools Infinite Carousel */}
        <div className="tools-carousel mt-4 sm:mt-6 md:mt-8 lg:mt-10 py-1 overflow-hidden">
          <div className="tools-carousel__wrapper">
            {/* First set of tools */}
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
                <div key={tool.id} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
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
                <div key={`dup-${tool.id}`} className="tools-carousel__item w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 opacity-70">
                  <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARCHIVES / GALLERY SECTION */}
      <section id="archives" className="gallery">
         <img 
            src="/assets/archive.png" 
            alt="Archive" 
            className="archive__image reveal w-[90%] md:w-[80%] lg:w-full" 
        />
        <h2 className="section-title reveal text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,10vw,7rem)]">ARCHIVES</h2>
        
        <div className="gallery__track reveal flex gap-4 md:gap-6 lg:gap-8 px-4 md:px-8 lg:px-(--gutter) overflow-x-auto pb-6 scrollbar-hide"> 
            {[
              { id: '01', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
              { id: '02', bg: 'linear-gradient(135deg, #0f0f23, #1a1a3e)' },
              { id: '03', bg: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)' },
              { id: '04', bg: 'linear-gradient(135deg, #0a1a1a, #1a3a3a)' },
              { id: '05', bg: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }
            ].map(item => (
              <div className="gallery__item min-w-65 sm:min-w-70 md:min-w-80" key={item.id}>
                <div className="gallery__image" style={{ background: item.bg }}>
                    <span className="gallery__placeholder">{item.id}</span>
                </div>
              </div>
            ))}
        </div>
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
const WorkItem = ({ title, category, num }) => (
  <article className="work-item">
    <a href="#" className="work-item__link flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4 py-6 sm:py-8 md:py-10 lg:py-14 px-4 md:px-8 lg:px-(--gutter)">
      <div className="work-item__info order-2 sm:order-1">
        <h3 className="work-item__title text-xl sm:text-2xl md:text-3xl lg:text-[clamp(2rem,5vw,3.5rem)]">{title}</h3>
        <p className="work-item__category text-sm sm:text-base">{category}</p>
      </div>
      <span className="work-item__number order-1 sm:order-2 text-sm sm:text-base">{num}</span>
    </a>
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