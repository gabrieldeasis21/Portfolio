import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

/* ── Liquid Glass Styles ── */
const glassPanel = {
  background:
    'linear-gradient(135deg, rgba(30,30,30,0.55) 0%, rgba(50,50,50,0.40) 50%, rgba(30,30,30,0.50) 100%)',
  backdropFilter: 'blur(28px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
  boxShadow:
    'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const glassButton = {
  background:
    'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
  boxShadow:
    'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 1px 4px rgba(0,0,0,0.12)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const glassButtonHover = {
  background:
    'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
  boxShadow:
    'inset 0 1px 0 0 rgba(255,255,255,0.22), 0 4px 16px rgba(0,0,0,0.18)',
  border: '1px solid rgba(255,255,255,0.2)',
};

const glassTooltip = {
  background:
    'linear-gradient(135deg, rgba(30,30,30,0.65) 0%, rgba(40,40,40,0.50) 100%)',
  backdropFilter: 'blur(24px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
  boxShadow:
    'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 8px 28px rgba(0,0,0,0.25)',
  border: '1px solid rgba(255,255,255,0.1)',
};

/* ── Dock Item ── */
function DockItem({
  item,
  spring,
  distance,
  magnification,
  baseItemSize,
  position,
  setHoveredIndex,
  hoveredIndex,
  isTouchDevice,
}) {
  const ref = useRef(null);
  const mouseXMotion = useMotionValue(0);

  const isActive = hoveredIndex === item.id;

  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseXMotion.set(e.clientX - (rect.x + rect.width / 2));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseXMotion, isTouchDevice]);

  const targetSize = useTransform(
    mouseXMotion,
    [-distance, 0, distance],
    [baseItemSize, isTouchDevice ? baseItemSize : magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-pointer"
      style={{ width: size, height: size }}
      onMouseEnter={() => !isTouchDevice && setHoveredIndex(item.id)}
      onMouseLeave={() => !isTouchDevice && setHoveredIndex(null)}
      onClick={item.onClick}
      tabIndex={0}
      role="button"
      aria-label={item.label}
    >
      {/* Icon button */}
      <motion.div
        className="relative flex h-full w-full items-center justify-center rounded-2xl transition-all duration-200"
        style={isActive ? glassButtonHover : glassButton}
      >
        <div className="flex items-center justify-center text-white/90 group-hover:text-white transition-colors duration-200">
          {item.icon}
        </div>
      </motion.div>

      {/* Tooltip */}
      {!isTouchDevice && (
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: position === 'top' ? -4 : 4, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 300, damping: 24 },
              }}
              exit={{ opacity: 0, y: position === 'top' ? -4 : 4, scale: 0.96 }}
              className="absolute left-1/2 z-50 -translate-x-1/2 pointer-events-none"
              style={{
                ...(position === 'top'
                  ? { top: '100%', marginTop: 8 }
                  : { bottom: '100%', marginBottom: 8 }),
                whiteSpace: 'nowrap',
              }}
            >
              <div
                className="rounded-xl px-3 py-1.5"
                style={glassTooltip}
              >
                <span className="text-[13px] font-medium text-white/95 tracking-tight">
                  {item.label}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* ── Main Dock ── */
export default function MagicDock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 170, damping: 14 },
  magnification = 68,
  distance = 150,
  panelHeight = 60,
  dockHeight = 220,
  baseItemSize = 44,
  position = 'top',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  );
  const isHovered = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const maxHeight = Math.max(dockHeight, magnification + magnification / 2 + 4);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: 'none' }}
      className={`flex max-w-full ${position === 'top' ? 'items-start' : 'items-end'} ${className}`}
    >
      <motion.div
        onMouseMove={() => !isTouchDevice && isHovered.set(1)}
        onMouseLeave={() => {
          if (!isTouchDevice) {
            isHovered.set(0);
            setHoveredIndex(null);
          }
        }}
        className="flex items-center gap-4 rounded-2xl px-5"
        style={{ height: panelHeight, ...glassPanel }}
        role="toolbar"
        aria-label="Navigation dock"
      >
        {items.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            position={position}
            setHoveredIndex={setHoveredIndex}
            hoveredIndex={hoveredIndex}
            isTouchDevice={isTouchDevice}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
