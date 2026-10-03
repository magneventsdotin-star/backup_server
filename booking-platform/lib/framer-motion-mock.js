import React from 'react';

// All framer-motion-specific props that must NOT be forwarded to DOM elements
const MOTION_PROPS = new Set([
  'initial', 'animate', 'transition', 'variants', 'whileHover', 'whileTap',
  'whileInView', 'whileDrag', 'whileFocus', 'viewport', 'exit', 'layout',
  'layoutId', 'layoutDependency', 'onAnimationStart', 'onAnimationComplete',
  'onUpdate', 'onLayoutAnimationStart', 'onLayoutAnimationComplete',
  'drag', 'dragConstraints', 'dragElastic', 'dragMomentum', 'dragPropagation',
  'dragSnapToOrigin', 'dragTransition', 'dragDirectionLock', 'onDrag',
  'onDragStart', 'onDragEnd', 'onDirectionLock', 'onMeasureDragConstraints',
  'transformTemplate', 'custom', 'inherit', 'ignoreStrict',
]);

const componentCache = new Map();

function createMotionComponent(tagName) {
  const MotionMock = React.forwardRef((allProps, ref) => {
    const domProps = {};
    for (const key in allProps) {
      if (!MOTION_PROPS.has(key)) {
        domProps[key] = allProps[key];
      }
    }
    return React.createElement(tagName, { ref, ...domProps });
  });
  MotionMock.displayName = `motion.${tagName}`;
  return MotionMock;
}

// A mock motion object that returns standard HTML elements with stable references
export const motion = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop !== 'string') return undefined;
    if (!componentCache.has(prop)) {
      componentCache.set(prop, createMotionComponent(prop));
    }
    return componentCache.get(prop);
  }
});
export const m = motion;

// AnimatePresence just renders its children immediately without exit animations
export const AnimatePresence = ({ children }) => <>{children}</>;

// useInView always returns true so components mount their "visible" state instantly
export const useInView = () => true;

// Mock animate function to trigger onUpdate immediately and return a dummy controls object
export const animate = (from, to, options) => {
  if (options && typeof options.onUpdate === 'function') {
    options.onUpdate(to);
  }
  return { stop: () => {} };
};

export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useScroll = () => ({ scrollYProgress: { onChange: () => {}, get: () => 0 } });
export const useTransform = () => 0;
export const useSpring = () => 0;
export const useIsPresent = () => true;
export const LayoutGroup = ({ children }) => <>{children}</>;
export const LazyMotion = ({ children }) => <>{children}</>;
export const domAnimation = {};
export const domMax = {};
