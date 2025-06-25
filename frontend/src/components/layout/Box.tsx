import { Box as MUIBox } from '@mui/material';
import { FC, ReactNode } from 'react';
import {
  Percentage,
  Pixel,
  ViewportHeight,
  ViewportWidth,
} from '@/providers/theme-provider';

export type BoxProps = {
  width?: Percentage | ViewportWidth | Pixel | 'auto';
  height?: Percentage | ViewportHeight | Pixel | 'auto';
  maxWidth?: Percentage | ViewportWidth | Pixel | 'auto';
  maxHeight?: Percentage | ViewportHeight | Pixel | 'auto';
  padding?: string;
  margin?: string;
  invisible?: boolean;
  children?: ReactNode;
};

/**
 *
 * @param {Percentage | ViewportWidth | Pixel} width - The width of the div created by the component (e.g., '100%', '50vw', '20px').
 * @param {Percentage | ViewportHeight | Pixel} height - The height of the div created by the component. (e.g., '100%', '50vh, '20px'),
 * @param {Percentage | ViewportHeight | Pixel} maxWidth - The max width of the div created by the component. (e.g., '100%', '50vh, '20px'),
 * @param {string} padding - The padding of the created div. Works as css
 * @param {string} margin - The margin of the created div. Works as css
 * @param {boolean} invisible - Whether the div is invisible, but occupy the space.
 * @param {ReactNode} children - The child nodes to render inside the flex container.
 * @constructor
 * @returns {JSX.Element} - Returns a div container.
 */
export const Box: FC<BoxProps> = ({
  width,
  height,
  maxWidth,
  maxHeight,
  padding,
  margin,
  children,
}: BoxProps): ReactNode => {
  return (
    <MUIBox
      width={width}
      height={height}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      sx={{ padding, margin, boxSizing: 'border-box' }}
    >
      {children}
    </MUIBox>
  );
};
