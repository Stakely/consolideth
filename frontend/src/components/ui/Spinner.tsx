import './spinner.css';
import { FC, ReactNode } from 'react';
import { Pixel, useTheme } from '@/providers/theme-provider';
import { Icon, Text } from '@/components';

export type SpinnerProps = {
  /** A set of styles for the spinner */
  variant?: 'primary' | 'secondary' | 'logo';

  /** The size of the spinner */
  size?: Pixel;

  /** The size of the stroke */
  strokeWidth?: Pixel;

  /** Text to be displayed under the spinner */
  text?: string;
};

/**
 * A Spinner component to be shown in loading states.
 */
export const Spinner: FC<SpinnerProps> = ({
  variant = 'primary',
  size,
  strokeWidth,
  text,
}: SpinnerProps): ReactNode => {
  const { colors } = useTheme();

  const getColor = (): string => {
    if (variant === 'primary') {
      return colors.primary['01'];
    }

    if (variant === 'secondary') {
      return colors.primary['02'];
    }

    return colors.primary['02'];
  };

  const getSize = (): Pixel => {
    if (variant === 'logo') {
      return size ?? '50px';
    }

    return size ?? '24px';
  };

  const getStrokeWidth = (): Pixel => {
    if (variant === 'logo') {
      return strokeWidth ?? '4px';
    }

    return strokeWidth ?? '3px';
  };

  const getLogoSize = (): Pixel => {
    const rawSize = size ?? '50px';
    const numericValue = parseInt(rawSize, 10);

    const adjustedSize = Math.max(numericValue - 20, 0);

    return `${adjustedSize}px`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: `${getSize()}`,
          height: `${getSize()}`,
          border: `${getStrokeWidth()} solid ${colors.background['00']}`,
          borderTop: `${getStrokeWidth()} solid ${getColor()}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {variant === 'logo' && <Icon name={'logo'} size={getLogoSize()} />}
      </div>
      {text && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text content={text} />
          <span className="spinner-dot">.</span>
          <span className="spinner-dot">.</span>
          <span className="spinner-dot">.</span>
        </div>
      )}
    </div>
  );
};
