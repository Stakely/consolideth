import { FC, ReactNode } from 'react';
import { Icon as IconType } from './icons/icons.tsx';
import { Pixel, Rem, useTheme } from '@/providers/theme-provider';
import { Flex, Icon, Text } from '@/components';

type ErrorMessageProps = {
  /**
   * The error message text to be displayed.
   * This content is shown next to the error icon.
   */
  content: string;

  /**
   * The horizontal alignment of the error text.
   * - 'left' aligns the text to the left.
   * - 'center' centers the text horizontally.
   * - 'right' aligns the text to the right.
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Name of the icon to display next to the error message.
   * If not provided, a default 'exclamationMark' icon will be used.
   */
  icon?: IconType;

  /**
   * Font size of the error message text.
   * Accepts valid CSS units (e.g., '12px', '1rem').
   */
  size?: Pixel | Rem;

  /**
   * Color of both the icon and the error text.
   * If not specified, the component uses the theme's default error color.
   */
  color?: string;
};

/**
 * Returns the text received with the appropriated styles applied.
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({
  content,
  icon,
  size,
  color,
  align = 'center',
}: ErrorMessageProps): ReactNode => {
  const { colors } = useTheme();
  return (
    <Flex spacing={'5px'} items={'center'} direction={'row'}>
      <Icon
        name={icon ?? 'exclamationMark'}
        size={size ?? '20px'}
        color={color ?? colors.secondary.redMedium}
      />
      <Text
        variant={'littleBody'}
        weight={700}
        color={color ?? colors.secondary.redMedium}
        content={content}
        align={align}
        forceSize={size}
      />
    </Flex>
  );
};
