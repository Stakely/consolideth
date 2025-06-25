import { FC, ReactNode } from 'react';
import { Percentage, Pixel, useTheme } from '@/providers/theme-provider';

type DividerProps = {
  /**
   * Orientation of the divider.
   * - 'horizontal' creates a line that grows along the X axis (left to right).
   * - 'vertical' creates a line that grows along the Y axis (top to bottom).
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Color of the divider.
   * If not provided, a default theme-based color will be used depending on the orientation.
   */
  color?: string;

  /**
   * Thickness of the divider.
   * For horizontal orientation, it represents height.
   * For vertical orientation, it represents width.
   * Accepts any valid CSS size value (e.g., '2px', '0.5rem').
   */
  thickness?: Pixel;

  /**
   * Length of the divider along the main axis.
   * - For horizontal: sets the width.
   * - For vertical: sets the height.
   * If not set, defaults to 100% (fills container).
   */
  length?: Pixel | Percentage;

  /**
   * Opacity of the divider, from 0 (fully transparent) to 1 (fully opaque).
   * @default 1
   */
  opacity?: number;
};

/**
 * Returns a Divider component oriented to separate concepts.
 */
export const Divider: FC<DividerProps> = ({
  orientation = 'horizontal',
  color,
  thickness,
  opacity = 1,
  length,
}: DividerProps): ReactNode => {
  const { colors } = useTheme();

  const getColor = (): string => {
    if (color) return color;
    return orientation === 'horizontal'
      ? colors.background['07']
      : colors.background['03'];
  };

  const getThickness = (): Pixel => {
    if (thickness) return thickness;
    return orientation === 'vertical' ? '11px' : '2px';
  };

  return (
    <div
      style={{
        width:
          orientation === 'horizontal' ? (length ?? '100%') : getThickness(),
        height:
          orientation === 'horizontal' ? getThickness() : (length ?? '100%'),
        backgroundColor: getColor(),
        border: 'none',
        opacity,
      }}
    />
  );
};
