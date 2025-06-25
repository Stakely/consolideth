import { FC, ReactNode, useEffect, useState } from 'react';
import { Icon as IconType } from './icons/icons.tsx';
import { Pixel, useTheme } from '@/providers/theme-provider';
import { Icon, Tooltip } from '@/components';

type IconButtonProps = {
  /**
   * The icon to be rendered inside the button.
   * This is a required prop and defines the visual symbol of the button.
   */
  icon: IconType;

  /**
   * Optional custom color for the icon.
   * If not provided, the color will be determined by the theme and component state.
   */
  iconColor?: string;

  /**
   * Optional custom background color for the button.
   * If defined, it overrides the color defined by the `variant` prop.
   */
  buttonColor?: string;

  /**
   * Visual style of the button.
   * - 'primary': Default solid button style.
   * - 'secondary': Alternative color scheme.
   * - 'transparent': No background color.
   */
  variant?: 'primary' | 'secondary' | 'transparent';

  /**
   * Function to be called when the button is clicked.
   * If the button is disabled, this function will not be triggered.
   */
  onClick?: () => void;

  /**
   * Configuration for the tooltip behavior and content.
   * - Pass `false` to disable the tooltip entirely.
   * - When an object is provided:
   *   - `contentOnClick`: Tooltip text shown when the button is clicked.
   *   - `contentOnHover`: Tooltip text shown when the button is hovered (if `onHover` is true).
   *   - `onHover`: Enables tooltip visibility on hover.
   *   - `backgroundColorOnClick`: Tooltip background color on click.
   *   - `backgroundColorOnHover`: Tooltip background color on hover.
   */
  tooltip?:
    | false
    | {
        contentOnClick?: string;
        contentOnHover?: string | ReactNode;
        onHover?: boolean;
        backgroundColorOnClick?: string;
        backgroundColorOnHover?: string;
      };

  /**
   * Whether the button is in a disabled state.
   * When true, disables interaction and updates visual styling.
   */
  disabled?: boolean;

  /**
   * Size of the icon inside the button.
   * Accepts any valid CSS size value (e.g., '14px', '1rem').
   */
  iconSize?: Pixel;

  /**
   * Whether to stop the click event from propagating to parent elements.
   * Useful to prevent undesired behavior in nested clickable areas.
   */
  stopPropagation?: boolean;
};

/**
 * Returns a button which only contains an icon
 */
export const IconButton: FC<IconButtonProps> = ({
  variant = 'primary',
  icon,
  iconColor,
  buttonColor,
  onClick = () => {},
  tooltip,
  disabled = false,
  iconSize = '14px',
  stopPropagation = false,
}: IconButtonProps): ReactNode => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);

  const { colors } = useTheme();
  useEffect(() => {
    if (isHovered && tooltip && tooltip.onHover) {
      setIsTooltipVisible(true);
      return;
    }

    setIsTooltipVisible(false);
  }, [isHovered]);

  const getBackgroundColor = (): string => {
    if (buttonColor) {
      return buttonColor;
    }

    if (variant === 'transparent') {
      return colors.transparent;
    }

    if (disabled) {
      return colors.background['06'];
    }

    if (isClicked) {
      if (variant === 'primary') {
        return colors.background['05'];
      }

      return colors.secondary.redHigh;
    }

    if (isHovered) {
      if (variant === 'primary') {
        return colors.background['04'];
      }

      return colors.secondary.redHigh;
    }

    if (variant === 'primary') {
      return colors.primary['01'];
    }

    return colors.secondary.redMedium;
  };

  const getIconColor = (): string => {
    if (iconColor) {
      return iconColor;
    }

    if (disabled) {
      return colors.background['03'];
    }

    return colors.background['00'];
  };

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) {
      return;
    }

    setIsClicked(true);
    if (tooltip) {
      setIsTooltipVisible(true);
    }

    if (stopPropagation) {
      event.stopPropagation();
    }

    onClick();
  };

  return (
    <Tooltip
      content={
        tooltip
          ? isClicked
            ? tooltip.contentOnClick
            : tooltip.contentOnHover
          : ''
      }
      onClickAway={() => setIsTooltipVisible(false)}
      isVisible={isTooltipVisible}
      backgroundColor={
        tooltip
          ? isClicked
            ? tooltip.backgroundColorOnClick
            : tooltip.backgroundColorOnHover
          : 'primary_navy'
      }
    >
      <div
        data-testid="icon-button"
        onMouseEnter={() => {
          setFlag(true);
          if (!flag) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          setIsTooltipVisible(false);
          setTimeout(() => {
            setIsClicked(false);
            setIsHovered(false);
          }, 100);
          setFlag(false);
        }}
        onClick={handleClick}
        style={{
          cursor: disabled ? 'auto' : 'pointer',
          backgroundColor: getBackgroundColor(),
          padding: '10px',
          borderRadius: '24px',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Icon
          name={icon}
          size={iconSize}
          clickable={!disabled}
          color={getIconColor()}
        />
      </div>
    </Tooltip>
  );
};
