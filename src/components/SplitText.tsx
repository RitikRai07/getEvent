import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  // Custom split function
  const splitTextIntoElements = (text: string, type: string) => {
    if (type === 'chars') {
      return text.split('').map((char, i) => (
        <span key={i} className="split-char" style={{ display: 'inline-block', willChange: 'transform' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    } else if (type === 'words') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="split-word" style={{ display: 'inline-block', marginRight: '0.25em', willChange: 'transform' }}>
          {word}
        </span>
      ));
    }
    return text;
  };

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      const targets = el.querySelectorAll(`.split-${splitType === 'chars' ? 'char' : 'word'}`);

      if (targets.length === 0) return;

      // If threshold is 0, animate immediately without ScrollTrigger
      if (threshold === 0) {
        gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            delay: 0.1, // Small delay to ensure DOM is ready
            onComplete: () => {
              onLetterAnimationComplete?.();
            },
          }
        );
      } else {
        // Use ScrollTrigger for scroll-based animations
        const startPct = (1 - threshold) * 100;
        const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
        const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
        const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
        const sign =
          marginValue === 0
            ? ''
            : marginValue < 0
              ? `-=${Math.abs(marginValue)}${marginUnit}`
              : `+=${marginValue}${marginUnit}`;
        const start = `top ${startPct}%${sign}`;

        gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
            },
            onComplete: () => {
              onLetterAnimationComplete?.();
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: ref
    }
  );

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  };

  const classes = `split-parent ${className}`;
  const content = splitTextIntoElements(text, splitType);

  const commonProps = {
    ref: ref as any,
    style,
    className: classes,
  };

  switch (tag) {
    case 'h1':
      return <h1 {...commonProps}>{content}</h1>;
    case 'h2':
      return <h2 {...commonProps}>{content}</h2>;
    case 'h3':
      return <h3 {...commonProps}>{content}</h3>;
    case 'h4':
      return <h4 {...commonProps}>{content}</h4>;
    case 'h5':
      return <h5 {...commonProps}>{content}</h5>;
    case 'h6':
      return <h6 {...commonProps}>{content}</h6>;
    case 'span':
      return <span {...commonProps}>{content}</span>;
    default:
      return <p {...commonProps}>{content}</p>;
  }
};

export default SplitText;
