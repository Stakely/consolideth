import { FC } from 'react';
import './SuccessIcon.css';
import { Pixel, useTheme } from '@/providers/theme-provider';

type SuccessIconProps = {
  size: Pixel;
  color?: string;
};

export const SuccessIcon: FC<SuccessIconProps> = ({ size, color }) => {
  const { colors } = useTheme();

  return (
    <div
      className="success-animation"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg viewBox="-2 -2 56 56" className="checkmark">
        <circle
          className="circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke={color ?? colors.secondary.greenMedium}
        />
        <path
          className="check"
          fill="none"
          d="M14 27l7 7 17-17"
          stroke={color ?? colors.secondary.greenMedium}
        />
      </svg>
    </div>
  );
};
