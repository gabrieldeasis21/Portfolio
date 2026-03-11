import { motion } from 'framer-motion'

const tools = [
  {
    name: 'Figma',
    svg: (
      <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="currentColor" opacity="0.8"/>
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="currentColor" opacity="0.6"/>
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="currentColor" opacity="0.6"/>
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="currentColor" opacity="0.7"/>
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.9"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1" opacity="0.7" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1" opacity="0.7" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    svg: (
      <svg viewBox="0 0 54 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.097 10.404C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.403 5.796C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.464 12.972 24.954 14.597 26.604C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.903 21.996C23.256 19.31 20.192 16.2 13.5 16.2Z" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="2" fill="currentColor" opacity="0.15"/>
        <path d="M7 18.5L8.5 16.5C9.2 17.5 9.8 18 10.8 18C11.7 18 12.2 17.5 12.2 16.8V10H14.5V16.9C14.5 18.8 13.3 19.8 11 19.8C8.9 19.8 7.7 18.9 7 18.5Z" fill="currentColor" opacity="0.8"/>
        <path d="M15.5 18.2L17 16.3C17.9 17.2 19.1 17.8 20.1 17.8C20.9 17.8 21.4 17.4 21.4 16.8C21.4 16.2 20.9 15.9 19.8 15.4L19.1 15.1C17.5 14.4 16.4 13.5 16.4 11.7C16.4 10.1 17.6 8.9 19.6 8.9C21.1 8.9 22.1 9.4 22.9 10.3L21.5 12.1C21 11.5 20.4 11.2 19.6 11.2C18.8 11.2 18.4 11.6 18.4 12C18.4 12.6 18.8 12.9 19.8 13.3L20.5 13.6C22.4 14.4 23.5 15.2 23.5 17.1C23.5 19.1 22 20.2 20.1 20.2C18.2 20.2 16.6 19.4 15.5 18.2Z" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
  {
    name: 'Node.js',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5L22.5 7.5V16.5L12 22.5L1.5 16.5V7.5L12 1.5Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.12"/>
        <path d="M12 1.5V22.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
        <path d="M1.5 7.5L12 13.5L22.5 7.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
        <text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="700" opacity="0.8">N</text>
      </svg>
    ),
  },
  {
    name: 'Photoshop',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.15"/>
        <text x="5" y="16" fill="currentColor" fontSize="9" fontWeight="700" fontFamily="sans-serif" opacity="0.8">Ps</text>
      </svg>
    ),
  },
  {
    name: 'Illustrator',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.15"/>
        <text x="5.5" y="16" fill="currentColor" fontSize="9" fontWeight="700" fontFamily="sans-serif" opacity="0.8">Ai</text>
      </svg>
    ),
  },
  {
    name: 'WordPress',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700" opacity="0.8">W</text>
      </svg>
    ),
  },
  {
    name: 'Git',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.66 2.66a1.838 1.838 0 11-1.103 1.033l-2.48-2.48v6.53a1.838 1.838 0 11-1.512-.09V8.73a1.838 1.838 0 01-.998-2.41L7.629 3.586.452 10.764a1.55 1.55 0 000 2.188l10.48 10.48a1.55 1.55 0 002.186 0l10.43-10.43a1.55 1.55 0 000-2.188" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: 'VS Code',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.583 2L7.258 10.6 3.292 7.4.5 8.8v6.4l2.792 1.4 3.966-3.2L17.583 22 23.5 19.4V4.6L17.583 2zM17.5 17.2l-6.2-5.2 6.2-5.2v10.4z" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: 'Canva',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="8.5" fontWeight="700" opacity="0.8">C</text>
      </svg>
    ),
  },
  {
    name: 'Three.js',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1L21 12L3 23V1Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.12"/>
        <path d="M8 6L20 12L8 18V6Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" opacity="0.08"/>
        <path d="M12 9L19 12L12 15V9Z" fill="currentColor" opacity="0.25"/>
      </svg>
    ),
  },
  {
    name: 'HubSpot',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
        <circle cx="8" cy="5" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="8" cy="19" r="2" fill="currentColor" opacity="0.5"/>
        <line x1="8" y1="7" x2="8" y2="17" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <line x1="10" y1="5.5" x2="13" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <line x1="10" y1="18.5" x2="13" y2="12.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: 'Notion',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="18" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
        <line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
        <line x1="7" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
        <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    ),
  },
  {
    name: 'Google Analytics',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="14" width="4" height="8" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="10" y="8" width="4" height="14" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="18" y="2" width="4" height="20" rx="1" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
  {
    name: 'Framer Motion',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 0H24V8H14L4 0Z" fill="currentColor" opacity="0.8"/>
        <path d="M4 8H14L24 16H4V8Z" fill="currentColor" opacity="0.55"/>
        <path d="M4 16H14L4 24V16Z" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function ToolsSection() {
  return (
    <section id="tools" className="tools-section">
      <div className="tools-section__inner reveal">
        <p className="tools-section__badge" style={{ marginBottom: '1.25rem', padding: '0.4rem 1.2rem' }}>TOOLS & TECHNOLOGIES</p>
        <h2 className="tools-section__heading" style={{ marginBottom: '1rem' }}>
          Technologies I work with daily
        </h2>
        <p className="tools-section__subtext" style={{ margin: '0 auto 4rem auto', padding: '0' }}>
          From design to development to deployment — here&apos;s the stack that powers every project.
        </p>

        <motion.div
          className="tools-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              className="tools-grid__item"
              variants={itemVariants}
              style={{ padding: '2rem 1.5rem', gap: '0.75rem' }}
            >
              <div className="tools-grid__icon">
                {tool.svg}
              </div>
              <span className="tools-grid__name">{tool.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
