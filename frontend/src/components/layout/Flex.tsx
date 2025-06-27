import { FC } from 'react';
import { BoxProps } from './Box';
import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import { Pixel } from '@/providers/theme-provider';

type FlexProps = BoxProps & {
  direction?: 'column' | 'row';
  spacing?: number | Pixel;
  content?:
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'center'
    | 'start'
    | 'end';
  items?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  wrap?: boolean;
};

/**
 *
 * @param {Percentage | ViewportWidth | Pixel} width - The width of the div created by the component (e.g., '100%', '50vw', '20px').
 * @param {Percentage | ViewportHeight | Pixel} maxWidth - The max width of the div created by the component. (e.g., '100%', '50vh, '20px'),
 * @param {Percentage | ViewportHeight | Pixel} height - The height of the div created by the component. (e.g., '100%', '50vh, '20px'),
 * @param {string} padding - The padding of the created div,
 * @param {string} margin - The margin of the created div,
 * @param {boolean} invisible - Whether the div is invisible, but occupy the space.
 * @param {'row' | 'column'} direction - The flex direction of the container (default is 'column').
 * @param {number} spacing - Spacing according to the theme between child elements inside the flex container.
 * @param {'space-between' | 'space-around' | 'space-evenly' | 'center' | 'start' | 'end'} content - Whether the container should center its content.
 * @param {flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around} items - Whether the container should center its content.
 * @param {boolean} wrap - Whether the container should wrap its content.
 * @param {ReactNode} children - The child nodes to render inside the flex container.
 * @constructor
 * @returns {ReactNode} - Returns a flexbox container.
 *
 * @example
 */
export const Flex: FC<FlexProps> = ({
  width,
  maxWidth,
  height,
  padding,
  margin,
  invisible,
  direction,
  spacing,
  content,
  items,
  children,
  wrap = false,
}: FlexProps): ReactNode => {
  return (
    <Stack
      width={width}
      maxWidth={maxWidth}
      height={height}
      direction={direction}
      spacing={wrap ? '0' : spacing}
      justifyContent={content}
      alignItems={items}
      padding={padding}
      margin={margin}
      flexWrap={wrap ? 'wrap' : 'nowrap'}
      boxSizing={'border-box'}
      sx={{
        opacity: invisible ? 0 : 100,
        visibility: invisible ? 'hidden' : 'visible',
        gap: wrap ? spacing : '0',
      }}
    >
      {children}
    </Stack>
  );
};
