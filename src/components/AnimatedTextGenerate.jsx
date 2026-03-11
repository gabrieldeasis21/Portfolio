import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedTextGenerate = ({
  text,
  className = '',
  textClassName = '',
  blurEffect = true,
  speed = 0.5,
  highlightWords = [],
  highlightClassName = '',
  linkWords = [],
  linkHrefs = [],
  linkClassNames = [],
}) => {
  const [currentText, setCurrentText] = useState(text);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);
  const splitWords = text.split(' ');

  if (currentText !== text) {
    setCurrentText(text);
    setVisibleCount(0);
    setHasTriggered(false);
  }

  // Observe when the section enters the viewport
  useEffect(() => {
    if (!ref.current || hasTriggered) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasTriggered]);

  // Start word-by-word reveal only after triggered
  useEffect(() => {
    if (!hasTriggered) return;
    const intervalId = setInterval(
      () => {
        setVisibleCount((prev) => {
          if (prev >= splitWords.length) {
            clearInterval(intervalId);
            return prev;
          }
          return prev + 1;
        });
      },
      Math.max(speed * 200, 100),
    );

    return () => clearInterval(intervalId);
  }, [hasTriggered, speed, splitWords.length]);

  const generateWords = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.3em' }}>
        {splitWords.map((word, idx) => {
          const isVisible = idx < visibleCount;
          const remaining = splitWords.length - visibleCount;
          let capsuleCount = 4;
          if (remaining <= 2) capsuleCount = remaining;
          else if (remaining <= 4) capsuleCount = Math.min(3, remaining);
          else if (visibleCount === 0) capsuleCount = 2;
          else if (visibleCount < 3) capsuleCount = 3;

          const isUpcoming =
            idx >= visibleCount && idx < visibleCount + capsuleCount;
          const isHighlight =
            highlightWords.length > 0 &&
            highlightWords.some((hw) =>
              word.toLowerCase().includes(hw.toLowerCase()),
            );
          const linkIndex = linkWords.findIndex((lw) =>
            word.toLowerCase().includes(lw.toLowerCase()),
          );
          const isLink = linkIndex !== -1;

          if (isVisible) {
            const wordElement = (
              <motion.span
                key={`${word}-${idx}`}
                initial={{
                  opacity: 0,
                  filter: blurEffect ? 'blur(10px)' : 'none',
                }}
                animate={{
                  opacity: 1,
                  filter: blurEffect ? 'blur(0px)' : 'none',
                }}
                transition={{
                  duration: speed * 0.3,
                  ease: 'easeOut',
                }}
                className={`text-white ${isHighlight ? highlightClassName : ''}`}
                style={{ lineHeight: 1.15 }}
              >
                {word}
              </motion.span>
            );

            if (isLink && linkHrefs[linkIndex]) {
              return (
                <a
                  href={linkHrefs[linkIndex]}
                  key={`link-${idx}`}
                  className={linkClassNames[linkIndex] || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {wordElement}
                </a>
              );
            }
            return wordElement;
          }

          if (isUpcoming) {
            return (
              <motion.div
                key={`placeholder-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='bg-gray-600 rounded-full'
                style={{
                  width: `${Math.max(word.length * 0.7, 2.5)}em`,
                  height: '0.9em',
                  display: 'inline-block',
                }}
              />
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div ref={ref} className={className} style={{ textAlign: 'center' }}>
      <div>
        <div
          className={textClassName}
          style={{
            color: '#fff',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          {generateWords()}
        </div>
      </div>
    </div>
  );
};
