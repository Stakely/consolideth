import { FC, ReactNode } from 'react';
import { BoxProps } from '@/components';
import { getRgb, useTheme } from '@/providers/theme-provider';

type SurfaceProps = BoxProps & {
  /**
   * Background color of the surface.
   * If not provided, the default background color from the theme will be used.
   */
  background?: string;

  /**
   * Opacity level for the background color.
   * Value should be between 0 (fully transparent) and 1 (fully opaque).
   */
  opacity?: number;

  /**
   * Whether to render a border around the surface.
   * The color of the border is derived from the theme.
   */
  border?: boolean;

  /**
   * Specifies the color of the border.
   *
   * This variable is optional and can be used to set the color of the border
   * in string format. The color can be defined using valid CSS color values,
   * such as color names, hexadecimal, RGB, or HSL values.
   */
  borderColor?: string;

  /**
   * Defines the border radius of the surface.
   * - 'primary' applies full rounded corners.
   * - 'secondary' applies rounded corners only at the top.
   */
  radiusVariant?: 'primary' | 'secondary';

  /**
   * Whether the surface should grow to fill available space
   * when used in a flex container.
   */
  grow?: boolean;

  /**
   * Applies a subtle box shadow to create a visual elevation effect.
   * Useful for distinguishing the surface from the background.
   */
  elevated?: boolean;
};

/**
 * Returns the Surface component.
 *
 * This component is intended to be used for displaying content
 * on an elevated surface.
 *
 */
export const Surface: FC<SurfaceProps> = ({
  width = '100%',
  height = '100%',
  maxWidth = '100%',
  maxHeight = '100%',
  padding = '0px',
  background,
  opacity = 1,
  border = false,
  borderColor,
  radiusVariant = 'primary',
  elevated = true,
  children,
}: SurfaceProps): ReactNode => {
  const { colors, borderRadius } = useTheme();
  const rgb = getRgb(background ?? colors.background['07']);
  const borderRgb = getRgb(borderColor ?? colors.background['02']);

  return (
    <div
      style={{
        padding: padding,
        maxWidth,
        maxHeight,
        width,
        height,
        boxSizing: 'border-box',
        border: border
          ? `1px solid rgba(${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}, 1)`
          : 'none',
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
        borderRadius:
          radiusVariant === 'primary'
            ? `${borderRadius.surface}`
            : `${borderRadius.surface} ${borderRadius.surface} 0px 0px`,
        overflowY: 'auto',
        boxShadow: `0px 4px 12px rgba(0, 0, 0, ${elevated ? 0.4 : 0})`,
      }}
    >
      {children}
    </div>
  );
};
