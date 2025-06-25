import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { Input as MUIInput } from '@mui/material';
import { Icon as IconType } from './icons/icons.tsx';
import { useTheme } from '@/providers/theme-provider';
import { Flex, Icon, Spinner, Text } from '@/components';

type InputProps = {
  /**
   * Visual style of the input.
   * - 'primary': Default style with light background.
   * - 'secondary': Alternative style with darker background.
   */
  variant?: 'primary' | 'secondary';

  /**
   * Label displayed above the input field.
   * Optional, used for better accessibility and context.
   */
  label?: string;

  /**
   * Placeholder text displayed inside the input when it's empty.
   * Helps the user understand the expected input format.
   */
  placeholder?: string;

  /**
   * Defines the main type of input.
   * - 'text': Standard text input.
   * - 'email': Email input field.
   * - 'password': Password input field with visibility toggle.
   * - 'number': Numeric input.
   * - 'button': Input with a button on the right side.
   */
  type?: 'email' | 'text' | 'password' | 'number' | 'button';

  /**
   * Subtype used when `type` is 'button', to define the input’s actual behavior.
   * Useful for preserving input logic while customizing appearance.
   */
  subType?: 'email' | 'text' | 'password' | 'number';

  /**
   * Size of the input field.
   * Affects padding and visual appearance.
   * - 'sm': Small
   * - 'md': Medium
   * - 'lg': Large
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the input is in an error state.
   * Displays a red border around the input if true.
   */
  error?: boolean;

  /**
   * Optional icon to display at the start of the input.
   * Helps visually identify the type of data expected.
   */
  icon?: IconType;

  /**
   * The color of the icon
   */
  iconColor?: string;

  /**
   * Background color of the button (only used when type is 'button').
   * Overrides the default color defined by the theme.
   */
  buttonColor?: string;

  /**
   * Text content of the button (only used when type is 'button').
   */
  buttonLabel?: string;

  /**
   * Whether the button is disabled (only used when type is 'button').
   * Disables click events and updates styling accordingly.
   */
  isButtonDisabled?: boolean;

  /**
   * Whether the button shows a loading spinner (only used when type is 'button').
   */
  isButtonLoading?: boolean;

  /**
   * Marks the field as optional.
   * Adds "(optional)" text next to the label for clarity.
   */
  optional?: boolean;

  /**
   * Current value of the input.
   * Acts as a controlled input when used in combination with `updateModel`.
   */
  value?: string;

  /**
   * Whether the input is disabled.
   * Disables typing and updates styling to reflect the disabled state.
   */
  disabled?: boolean;

  /**
   * Callback function called on every input change.
   * Receives the trimmed string value from the input.
   */
  updateModel?: (value: string) => void;

  /**
   * Callback function called when the input loses focus.
   */
  onBlur?: () => void;

  /**
   * Callback function called when the button is clicked (only used when type is 'button').
   */
  onButtonClicked?: () => void;

  /**
   * The background color of the input
   */
  bgColor?: string;
};

/**
 * Returns an Input component
 */
export const Input: FC<InputProps> = ({
  variant = 'primary',
  label = '',
  placeholder = '',
  type = 'text',
  subType = 'text',
  size = 'sm',
  error = false,
  icon,
  iconColor,
  buttonColor = '',
  buttonLabel = '',
  isButtonDisabled = false,
  isButtonLoading = false,
  optional = false,
  value,
  disabled = false,
  updateModel = () => {},
  onBlur = () => {},
  onButtonClicked = () => {},
  bgColor,
}: InputProps): ReactNode => {
  const { colors, borderRadius } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const getBackgroundColor = (): string => {
    if (bgColor) {
      return bgColor;
    }

    if (variant === 'primary') {
      return colors.background['00'];
    }

    return colors.input;
  };

  const getPlaceholderColor = (): string => {
    if (variant === 'primary') {
      return colors.background['03'];
    }

    return colors.background['02'];
  };

  const getTextColor = (): string => {
    if (variant === 'primary') {
      return colors.secondary.black;
    }

    return colors.background['00'];
  };

  const getType = (): string => {
    if (type === 'button') {
      return subType;
    }

    if (type !== 'password') {
      return type;
    }

    if (isPasswordVisible) {
      return 'text';
    }

    return 'password';
  };

  const getRevealButton = () => {
    return (
      <div onClick={() => onRevealClicked()}>
        {isPasswordVisible && (
          <Icon size={'20px'} color={'background_03'} name={'hide'} clickable />
        )}
        {!isPasswordVisible && (
          <Icon size={'20px'} color={'background_03'} name={'eye'} clickable />
        )}
      </div>
    );
  };

  const onRevealClicked = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getEndAdornment = () => {
    if (type === 'password') {
      return getRevealButton();
    }

    if (type === 'button') {
      return (
        <div
          onClick={() => {
            if (isButtonDisabled) {
              return;
            }

            onButtonClicked();
          }}
          style={{
            position: 'relative',
            padding: '5px 12px',
            backgroundColor: buttonColor ?? colors.primary['01'],
            borderRadius: borderRadius.input,
            cursor: isButtonDisabled ? 'auto' : 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Plus Jakarta Sans',
            color: colors.background['00'],
          }}
        >
          <div
            style={{
              visibility: isButtonLoading ? 'hidden' : 'visible',
            }}
          >
            {buttonLabel}
          </div>
          {isButtonLoading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Spinner size={'16px'} variant={'secondary'} />
            </div>
          )}
        </div>
      );
    }
  };

  const getIconColor = (): string => {
    if (iconColor) {
      return iconColor;
    }

    if (variant === 'primary') {
      return colors.background['03'];
    }

    return colors.background['00'];
  };

  const getStartAdornment = () => {
    if (!icon) {
      return;
    }

    return (
      <div
        style={{
          paddingRight: '10px',
        }}
      >
        <Icon name={icon} size={'20px'} color={getIconColor()} />
      </div>
    );
  };

  return (
    <Flex spacing={'12px'} width={'100%'}>
      {label && (
        <Flex direction={'row'} spacing={'4px'}>
          <Text variant={'body1'} content={label} weight={700} />
          {optional && (
            <Text
              variant={'body1'}
              content={'(optional)'}
              color={'background_03'}
              italic
            />
          )}
        </Flex>
      )}
      <MUIInput
        disabled={disabled}
        type={getType()}
        placeholder={placeholder}
        value={value}
        startAdornment={getStartAdornment()}
        endAdornment={getEndAdornment()}
        disableUnderline
        fullWidth
        onKeyDown={(event) => {
          if (type === 'button' && event.key === 'Enter') {
            onButtonClicked();
          }
        }}
        onChange={(event: ChangeEvent) => {
          updateModel(
            (event.target as unknown as { value: string }).value.trim()
          );
        }}
        onBlur={() => onBlur()}
        sx={{
          backgroundColor: getBackgroundColor(),
          borderRadius: borderRadius.input,
          padding:
            type === 'button' ? '10px 15px 10px 30px' : '15px 15px 15px 30px',
          border: error ? `4px solid ${colors.secondary.redMedium}` : 'none',
          '& input': {
            fontFamily: 'Plus Jakarta Sans',
          },
          '& input::placeholder': {
            opacity: 1,
            fontStyle: 'italic',
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Plus Jakarta Sans',
            color: getPlaceholderColor(),
          },
          '& .MuiInputBase-input': {
            padding: size === 'sm' ? '0' : '5px',
            color: getTextColor(),
          },
          transition: 'border-color 0.3s ease',
        }}
      />
    </Flex>
  );
};
