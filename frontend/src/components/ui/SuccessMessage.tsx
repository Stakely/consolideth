import { FC, ReactNode } from 'react';
import './SuccessMessage.css';
import { Pixel, Rem, useTheme } from '@/providers/theme-provider';
import { SuccessIcon, Text } from '@/components';

type SuccessMessageProps = {
  /**
   * The success message text to be displayed.
   * This content is shown next to the success icon.
   */
  content: string;

  /**
   * The horizontal alignment of the success text.
   * - 'left' aligns the text to the left.
   * - 'center' centers the text horizontally.
   * - 'right' aligns the text to the right.
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Font size of the success message text.
   * Accepts valid CSS units (e.g., '12px', '1rem').
   */
  size?: Pixel | Rem;

  /**
   * Color of both the icon and the success text.
   * If not specified, the component uses the theme's default success color.
   */
  color?: string;

  /**
   * Size of the success icon shown
   */
  iconSize?: Pixel;
};

/**
 * Returns the text received with the appropriated styles applied.
 */
export const SuccessMessage: FC<SuccessMessageProps> = ({
  content,
  size,
  color,
  iconSize,
  align = 'center',
}: SuccessMessageProps): ReactNode => {
  const { colors } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <SuccessIcon size={iconSize ?? '20px'} />
      <div className={'success-message-text'}>
        <Text
          variant={'littleBody'}
          weight={700}
          color={color ?? colors.secondary.greenMedium}
          content={content}
          align={align}
          forceSize={size}
        />
      </div>
    </div>
  );
};
