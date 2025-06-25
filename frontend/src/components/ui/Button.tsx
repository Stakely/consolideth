import { Button as MUIButton, ClickAwayListener, Tooltip } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { Icon as IconName } from './icons/icons.tsx';
import { getRgb, useTheme } from '@/providers/theme-provider';
import { Icon, Spinner } from '@/components';

export type ButtonProps = {
  /** The message inside the button */
  label?: string;

  /** Overrides the background color */
  background?: string;

  /** Overrides the text color */
  textColor?: string;

  /** A set of styles for the button */
  variant?: 'primary' | 'secondary' | 'shiny';

  /** Shows the button with transparent background but with borders */
  outlined?: boolean;

  /** Reduce the button size */
  reduced?: boolean;

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Whether the button is in loading state */
  loading?: boolean;

  /** Component with an icon to be rendered */
  icon?: IconName;

  /** The position of the icon */
  iconPosition?: 'start' | 'end';

  iconColor?: string;

  /** Function to be called when the button is clicked */
  onClick?: () => void;

  /** Shows a tooltip message when the button is clicked */
  tooltip?: string;

  /** The color of the button border */
  borderColor?: string;
};

/**
 * A button component
 */
export const Button: FC<ButtonProps> = ({
  label = '',
  variant = 'primary',
  background,
  textColor,
  outlined = false,
  reduced = false,
  disabled = false,
  loading = false,
  icon = undefined,
  iconPosition = 'start',
  onClick = () => {},
  tooltip,
  borderColor,
  iconColor,
}: ButtonProps): ReactNode => {
  const { colors, borderRadius } = useTheme();
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const getBackgroundColor = (): string => {
    if (background) {
      return background;
    }

    if (outlined) {
      return colors.transparent;
    }

    if (disabled) {
      return colors.background['03'];
    }

    if (variant === 'primary') {
      return colors.primary['02'];
    }

    return colors.primary['01'];
  };

  const getPadding = (): string => {
    if (reduced) {
      return '6px 16px';
    }

    if (variant === 'primary' || outlined) {
      return '15px 30px';
    }

    return '10px 25px';
  };

  const getBorderColor = (): string => {
    if (borderColor) {
      return borderColor;
    }

    if (background) {
      return background;
    }

    if (outlined && disabled) {
      return colors.background['03'];
    }

    if (outlined && variant === 'secondary') {
      return colors.primary['01'];
    }

    if (variant === 'primary') {
      return colors.primary['02'];
    }

    return colors.background['00'];
  };

  const getTextColor = (): string => {
    if (textColor) {
      return textColor;
    }

    if (outlined) {
      if (disabled) {
        return colors.background['02'];
      }

      if (variant === 'primary') {
        return colors.primary['02'];
      }

      if (outlined && variant === 'secondary') {
        return colors.primary['01'];
      }

      return colors.background['00'];
    }

    return colors.background['00'];
  };

  const getSpinnerVariant = (): 'primary' | 'secondary' => {
    if (outlined) {
      return 'secondary';
    }

    if (variant === 'shiny') {
      return 'secondary';
    }

    return variant;
  };

  const borderColorRgb = getRgb(getBorderColor());

  const handleClick = () => {
    if (tooltip) {
      setIsTooltipVisible(true);
      setTimeout(() => setIsTooltipVisible(false), 2000);
    }
    onClick();
  };

  const getButtonHoverColor = (): string => {
    if (outlined) {
      return `rgba(${borderColorRgb.r}, ${borderColorRgb.g}, ${borderColorRgb.b}, 0.1)`;
    }

    if (variant === 'primary') {
      return colors.primary['01'];
    }

    if (variant === 'secondary') {
      return colors.primary['02'];
    }

    return colors.primary['02'];
  };

  const getTextHoverColor = (): string => {
    if (variant === 'primary') {
      return colors.primary['02'];
    }

    if (variant === 'secondary') {
      return colors.primary['01'];
    }

    return colors.background['00'];
  };

  const getIconColor = (): string => {
    if (iconColor) {
      return iconColor;
    }

    return getTextColor();
  };

  return (
    <ClickAwayListener onClickAway={() => setIsTooltipVisible(false)}>
      <Tooltip title={tooltip} open={isTooltipVisible}>
        <MUIButton
          variant={outlined ? 'outlined' : 'contained'}
          onClick={handleClick}
          disabled={disabled}
          sx={{
            transition: 'all ease-in-out 300ms',
            color: getTextColor(),
            borderRadius: borderRadius.button,
            backgroundColor: getBackgroundColor(),
            background:
              variant !== 'shiny'
                ? 'auto'
                : 'radial-gradient(60.26% 100.81% at 64.71% -33.81%, #4DBE6E 0%, rgba(28, 53, 135, 0.00) 100%), radial-gradient(272.95% 245.28% at 79.08% 145.14%, #FF7748 0%, #192F74 64.5%), #000',
            width: 'fit-content',
            height: 'fit-content',
            padding: getPadding(),
            '&.Mui-disabled': {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              color: getTextColor(),
              fontFamily: 'Plus Jakarta Sans',
            },
            border: outlined ? `1px solid ${getBorderColor()}` : 'none',
            '&:hover': {
              background: getButtonHoverColor(),
              backgroundColor: getButtonHoverColor(),
              color: getTextHoverColor(),
            },
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              justifyContent: 'center',
              visibility: loading ? 'hidden' : 'visible',
            }}
          >
            {icon && iconPosition === 'start' && (
              <Icon name={icon} size={'18px'} color={getIconColor()} />
            )}
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20.16px',
                textTransform: 'none',
              }}
            >
              {label}
            </span>
            {icon && iconPosition === 'end' && (
              <Icon name={icon} size={'18px'} color={getIconColor()} />
            )}
          </div>
          {loading && (
            <div style={{ position: 'absolute' }}>
              <Spinner size={'16px'} variant={getSpinnerVariant()} />
            </div>
          )}
        </MUIButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
