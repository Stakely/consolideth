import { FC, ReactNode, useState } from 'react';
import { Icon as IconType, icons } from './icons/icons.tsx';
import { Pixel, Rem, useTheme } from '@/providers/theme-provider';

export type IconProps = {
  /** The icon to be shown. The name correspond to a key of the icons constant located in assets/icons */
  name: IconType;

  /** The color of the icon */
  color?: string;

  /** The rotation degrees to be applied to the icon */
  rotation?: number;

  /** The width and height of the icon */
  size: Pixel | Rem;

  /** Whether the icon is clickable. It will show an animation if true. */
  clickable?: boolean;

  /** When the icon is clickable, the color of the button when hovering */
  onHoverColor?: string;

  /** Function to be executed when the icon is clicked */
  onClick?: () => void;
};

/**
 * Component to render icons within the application.
 */
export const Icon: FC<IconProps> = ({
  name,
  color,
  rotation = 0,
  size,
  clickable,
  onHoverColor,
  onClick,
}: IconProps): ReactNode => {
  const { colors } = useTheme();
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setHovered] = useState<boolean>(false);

  const IconComponent = icons[name];

  const getColor = (): string => {
    if (isHovered && clickable) {
      return onHoverColor ?? colors.primary['02'];
    }

    if (!color) {
      return colors.background['00'];
    }

    return color;
  };

  const onClicked = () => {
    if (clickable) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClicked}
      style={{
        display: 'flex',
        height: `${size}`,
        opacity: isClicked ? 0.1 : 1,
        transition: 'all 0.3s ease, transform 0.3s ease-in-out',
        cursor: clickable ? 'pointer' : 'default',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <IconComponent
        style={{
          opacity: 1,
        }}
        width={size}
        height={size}
        fill={getColor()}
      />
    </div>
  );
};
