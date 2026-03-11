import React, { useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  AnimatePresence,
  useMotionTemplate,
} from 'framer-motion';
import { ArrowBigLeft, X } from 'lucide-react';

export default function ProfileCard({
  img,
  name,
  bio,
  skills = [],
  socialLinks = [],
  position,
  spotlight = false,
  spotlightColor = '14, 165, 233',
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isImageShrunken, setIsImageShrunken] = useState(false);
  const arrowControls = useAnimation();
  const dragX = useMotionValue(0);
  const dragThreshold = 50;
  const isAnimating = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const backgroundImage = useMotionTemplate`radial-gradient(300px circle at ${spotlightX}px ${spotlightY}px, rgba(${spotlightColor}, 0.15), transparent)`;

  const arrowRotation = useTransform(dragX, [0, dragThreshold], [-180, 145]);

  const handleDragEnd = () => {
    if (dragX.get() > dragThreshold && !isRevealed && !isAnimating.current) {
      isAnimating.current = true;
      arrowControls.start({ x: dragThreshold, transition: { duration: 0.2 } });
      setIsImageShrunken(true);
      setTimeout(() => {
        setIsRevealed(true);
        isAnimating.current = false;
      }, 400);
    } else if (dragX.get() <= dragThreshold && !isRevealed) {
      arrowControls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      });
    } else if (isRevealed) {
      arrowControls.start({
        x: dragThreshold,
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      });
    }
  };

  const resetCard = () => {
    if (isRevealed && !isAnimating.current) {
      isAnimating.current = true;
      x.set(0);
      y.set(0);
      arrowControls.start({ x: 0, transition: { duration: 0.3 } });
      setIsRevealed(false);
      setTimeout(() => {
        setIsImageShrunken(false);
        isAnimating.current = false;
      }, 300);
    }
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateDepth = 12;
  const translateDepth = 15;

  const rotateX = useTransform(y, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const rotateY = useTransform(x, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);
  const translateX = useTransform(x, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(y, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);

  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !isRevealed || isAnimating.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const buffer = 10;
    if (mouseXPos < -buffer || mouseXPos > rect.width + buffer || mouseYPos < -buffer || mouseYPos > rect.height + buffer) return;

    x.set(mouseXPos / rect.width - 0.5);
    y.set(mouseYPos / rect.height - 0.5);

    if (spotlight) {
      mouseX.set(mouseXPos);
      mouseY.set(mouseYPos);
      spotlightX.set(mouseXPos);
      spotlightY.set(mouseYPos);
    }
  };

  const handleMouseLeave = () => {
    if (isRevealed && !isAnimating.current) {
      setTimeout(() => {
        if (isRevealed && !isAnimating.current) {
          x.set(0);
          y.set(0);
        }
      }, 50);
    }
  };

  const renderSkillIcon = (skill) => {
    if (typeof skill.icon === 'string') {
      if (skill.icon.startsWith('<svg')) {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: skill.icon }}
            className="w-5 h-5 flex items-center justify-center"
          />
        );
      } else {
        return <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />;
      }
    }

    if (React.isValidElement(skill.icon)) {
      return React.cloneElement(skill.icon, { className: 'w-5 h-5' });
    }

    if (typeof skill.icon === 'function') {
      const IconComponent = skill.icon;
      return <IconComponent className="w-5 h-5" />;
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        ref={cardRef}
        className={`relative w-88 h-[28rem] rounded-[15px] overflow-hidden shadow-lg ${
          spotlight && isRevealed ? 'group' : ''
        }`}
        style={{
          boxShadow: '0 4px 10px rgba(255,255,255,0.1)',
          background: '#000',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...(isRevealed
          ? {
              style: {
                rotateX,
                rotateY,
                translateX,
                translateY,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out',
                boxShadow: '0 4px 10px rgba(255,255,255,0.1)',
                background: '#000',
              },
            }
          : {})}
      >
        {spotlight && isRevealed && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[15px] opacity-0 transition duration-300 group-hover:opacity-100"
            style={{ backgroundImage }}
          />
        )}

        <motion.div
          initial={{ width: '100%', height: '100%' }}
          animate={{
            width: isImageShrunken ? '7.5rem' : '100%',
            height: isImageShrunken ? '10rem' : '100%',
            top: isImageShrunken ? '5.5rem' : 0,
            left: isImageShrunken ? '1.75rem' : 0,
            borderRadius: isImageShrunken ? '0.5rem' : '0px',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute overflow-hidden"
        >
          <img src={img} alt={name} className="w-full h-full object-cover" />

          <motion.div
            className="absolute top-2 right-2 w-6.75 h-7.25 flex items-center justify-center bg-white rounded shadow-sm cursor-grab active:cursor-grabbing z-10"
            drag={!isRevealed ? 'x' : false}
            dragConstraints={{ left: 0, right: dragThreshold }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            animate={arrowControls}
            whileTap={!isRevealed ? { scale: 1.1 } : {}}
          >
            <motion.div style={{ rotate: arrowRotation }}>
              <ArrowBigLeft className="w-4 h-4 text-black pointer-events-none" />
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isRevealed && (
            <motion.div
              key="content"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full cursor-pointer z-20"
                onClick={resetCard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4 text-black" strokeWidth={2} />
              </motion.div>

              <div style={{ padding: '1.75rem 1.75rem 0.5rem 1.75rem' }}>
                <h1 className="text-2xl font-bold tracking-wider text-white">{name}</h1>
                <p className="text-sm tracking-wider text-white/70" style={{ marginTop: '0.35rem' }}>{position}</p>
              </div>

              <div className="absolute top-[5.5rem] left-[11rem]">
                <h3 className="text-base font-semibold mb-2 text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`bg-gray-800 rounded-md p-1 flex items-center justify-center w-8 h-8 ${
                        spotlight ? 'group relative overflow-hidden' : ''
                      }`}
                      title={skill.name}
                      onMouseMove={
                        spotlight
                          ? (e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const mx = e.clientX - rect.left;
                              const my = e.clientY - rect.top;
                              e.currentTarget.style.setProperty('--spotlight-x', `${mx}px`);
                              e.currentTarget.style.setProperty('--spotlight-y', `${my}px`);
                            }
                          : undefined
                      }
                    >
                      {spotlight && (
                        <div
                          className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(100px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${spotlightColor}, 0.2), transparent)`,
                          }}
                        />
                      )}
                      <div className="relative z-10">{renderSkillIcon(skill)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-[17rem] left-0 right-0" style={{ padding: '0 1.75rem' }}>
                <p className="text-sm leading-relaxed text-white/70">{bio}</p>
              </div>

              <div className="absolute bottom-7 left-7 flex gap-4">
                {socialLinks.map((social, index) => {
                  const renderIcon = () => {
                    if (typeof social.icon === 'string') {
                      return <img src={social.icon} alt={social.name} className="w-5 h-5 object-contain" />;
                    } else if (React.isValidElement(social.icon)) {
                      return React.cloneElement(social.icon, { className: 'w-5 h-5' });
                    } else if (typeof social.icon === 'function') {
                      const IconComponent = social.icon;
                      return <IconComponent className="w-5 h-5" />;
                    }
                    return null;
                  };

                  return (
                    <a key={index} href={social.url} target="_blank" rel="noreferrer">
                      <div
                        className={`w-5 h-5 relative flex items-center justify-center ${
                          spotlight ? 'group overflow-hidden rounded' : ''
                        }`}
                        title={social.name}
                        onMouseMove={
                          spotlight
                            ? (e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const mx = e.clientX - rect.left;
                                const my = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--spotlight-x', `${mx}px`);
                                e.currentTarget.style.setProperty('--spotlight-y', `${my}px`);
                              }
                            : undefined
                        }
                      >
                        {spotlight && (
                          <div
                            className="pointer-events-none absolute -inset-px rounded opacity-0 transition duration-300 group-hover:opacity-100"
                            style={{
                              background: `radial-gradient(80px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${spotlightColor}, 0.2), transparent)`,
                            }}
                          />
                        )}
                        <div className="relative z-10">{renderIcon()}</div>
                      </div>
                      <span className="sr-only">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isRevealed && !isImageShrunken && (
          <motion.div
            className="absolute top-2.5 right-8.75 text-white text-xs opacity-80 bg-black bg-opacity-50 px-2 py-1 rounded"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              transition: { repeat: Infinity, duration: 2, repeatDelay: 1 },
            }}
          >
            Drag →
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
