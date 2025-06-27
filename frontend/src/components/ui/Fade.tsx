import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';

type FadeComponentProps = {
  isVisible: boolean;
  onUnmount?: () => void;
  fixMargin?: string;
  duration?: number;
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Returns a component that appears or disappears with a Fade animation.
 *
 * @param {boolean} isVisible - Whether the content is visible.
 * @param {Function} onUnmount - Function to be executed when the component disappears.
 * @param {string} fixMargin - The margin in CSS property (e.g. "0px 0px 0px 0px") to be applied when the component is not visible.
 * @param {number} duration - The duration in milliseconds of the animation.
 * @param {'horizontal' | 'vertical'} orientation - The axis in which the component grows/shrinks.
 * @param {ReactNode} children - The content to apply the Fade effect.
 * @return {ReactNode} - The Fade Component
 */
export const Fade: FC<FadeComponentProps> = ({
  isVisible,
  onUnmount = () => {},
  fixMargin,
  duration = 500,
  children,
  orientation = 'vertical',
}: FadeComponentProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => {
        setShouldRender(false);
        onUnmount();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration, onUnmount]);

  const style =
    orientation === 'vertical'
      ? {
          maxHeight: isVisible ? '9999px' : '0px',
          transition: `max-height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out, margin ${duration}ms ease-in-out`,
        }
      : {
          maxWidth: isVisible ? '9999px' : '0px',
          transition: `max-width ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out, margin ${duration}ms ease-in-out`,
        };

  return (
    <div
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        overflow: 'hidden',
        margin: isVisible && fixMargin ? fixMargin : '0px',
        display: orientation === 'horizontal' ? 'flex' : 'block',
      }}
    >
      {shouldRender && <div ref={contentRef}>{children}</div>}
    </div>
  );
};
