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
      <nav className="nav">
        <a href="#intro" className="nav__link">INTRO</a>
        <a href="#contents" className="nav__link">CONTENTS</a>
        <a href="#about" className="nav__link">ABOUT ME</a>
        <a href="#services" className="nav__link">SERVICES</a>
        <a href="#archives" className="nav__link">ARCHIVES</a>
        <a href="#contact" className="nav__link">CONTACT</a>
      </nav>

      {/* 1. INTRO / HERO SECTION */}
      <section id="intro" className="hero">
        <img 
            src="/assets/portfolio_text.png" 
            alt="Gabriel De Asis" 
            className="hero__logo"
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
            <div className="contents-overlay">
                <nav className="array-nav">
                    <a href="#about" className="array-link">
                        <span className="array-index">{'<1>'}</span> ABOUT ME
                    </a>
                    <a href="#services" className="array-link">
                        <span className="array-index">{'<2>'}</span> SERVICES
                    </a>
                    <a href="#archives" className="array-link">
                        <span className="array-index">{'<3>'}</span> ARCHIVES
                    </a>
                    <a href="#contact" className="array-link">
                        <span className="array-index">{'<4>'}</span> CONTACT
                    </a>
                </nav>
            </div>
         </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="about">
        <h2 className="section-title reveal">ABOUT ME</h2>
        <div className="about__grid">
            <div className="about__column about__column--bio reveal">
                <h3 className="about__label">HI I'M</h3>
                <div className="about__name-large">
                    <span>Gabriel</span>
                    <span>De Asis</span>
                </div>
                <p className="about__text">
                    Your Digital Transformation Partner, specialized in optimizing business processes and enhancing online presence.
                </p>
                <p className="about__text">
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
        <h2 className="section-title reveal">SERVICES</h2>
        <div className="works__list reveal">
            <WorkItem title="Website Funnel Builder" category="Website building, CRM integration" num="01" />
            <WorkItem title="General Virtual Assistant" category="Administrative support" num="02" />
            <WorkItem title="Social Media Manager" category="Strategy & Content" num="03" />
        </div>
      </section>

      {/* 5. ARCHIVES / GALLERY SECTION */}
      <section id="archives" className="gallery">
         <img 
            src="/assets/archive.png" 
            alt="Archive" 
            className="archive__image reveal" 
        />
        <h2 className="section-title reveal">ARCHIVES</h2>
        
        <div className="gallery__track reveal"> 
            {[
              { id: '01', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
              { id: '02', bg: 'linear-gradient(135deg, #0f0f23, #1a1a3e)' },
              { id: '03', bg: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)' },
              { id: '04', bg: 'linear-gradient(135deg, #0a1a1a, #1a3a3a)' },
              { id: '05', bg: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }
            ].map(item => (
              <div className="gallery__item" key={item.id}>
                <div className="gallery__image" style={{ background: item.bg }}>
                    <span className="gallery__placeholder">{item.id}</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 6. CONTACT SECTION (With Form) */}
      <section id="contact" className="contact">
        <h2 className="section-title reveal">CONTACT</h2>
        
        <div className="contact-container reveal">
            {/* Left Side: The Form */}
            <div className="contact-form-wrapper">
                <h3 className="form-header">LET'S START A PROJECT</h3>
                
                {formState === 'success' ? (
                    <div className="form-success">
                        <p className="success-message">Message received. I'll get back to you shortly.</p>
                        <button onClick={() => setFormState('idle')} className="reset-btn">Send another</button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" id="name" required placeholder=" " className="form-input" />
                                <label htmlFor="name" className="form-label">Name</label>
                            </div>
                            <div className="form-group">
                                <input type="email" id="email" required placeholder=" " className="form-input" />
                                <label htmlFor="email" className="form-label">Email</label>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <input type="text" id="service" placeholder=" " className="form-input" />
                            <label htmlFor="service" className="form-label">What service are you interested in?</label>
                        </div>

                        <div className="form-group">
                            <textarea id="message" required placeholder=" " rows="1" className="form-input form-textarea"></textarea>
                            <label htmlFor="message" className="form-label">Tell me about your project</label>
                        </div>

                        <button type="submit" className="form-submit" disabled={formState === 'submitting'}>
                            {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                            <span className="arrow">↗</span>
                        </button>
                    </form>
                )}
            </div>

            {/* Right Side: Contact Details */}
            <div className="contact-details">
                <h3 className="details-header">CONTACT DETAILS</h3>
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
      <footer className="footer reveal">
        <a href="#" className="footer__logo">GDA© all rights reserved</a>
        <p className="footer__year">2026</p>
      </footer>

    </div>
  )
}

// --- 3. HELPER COMPONENTS ---
const WorkItem = ({ title, category, num }) => (
  <article className="work-item">
    <a href="#" className="work-item__link">
      <div className="work-item__info">
        <h3 className="work-item__title">{title}</h3>
        <p className="work-item__category">{category}</p>
      </div>
      <span className="work-item__number">{num}</span>
    </a>
  </article>
)

const TimelineItem = ({ year, title, place }) => (
  <div className="timeline__item">
    <span className="timeline__year">{year}</span>
    <p className="timeline__title">{title}</p>
    <p className="timeline__place">{place}</p>
  </div>
)

const ContactItem = ({ label, value, href }) => (
  <a href={href} className="contact__item" target="_blank" rel="noreferrer">
    <span className="contact__label">{label}: </span>
    <span className="contact__value">{value}</span>
  </a>
)

// --- 4. 3D BADGE COMPONENT ---
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef()
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  
  const { nodes, materials } = useGLTF('/assets/tag.glb')
  
  const texture = useTexture('/assets/string.png')
  const myProfilePic = useTexture('/assets/my-badge-photo.png')
  myProfilePic.flipY = false 
  
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

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
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