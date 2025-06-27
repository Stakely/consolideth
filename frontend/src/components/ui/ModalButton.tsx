import { FC, ReactNode, useState } from 'react';
import { useTheme } from '@/providers/theme-provider';
import { Text } from '@/components';
import { Spinner } from '@/components/ui/Spinner.tsx';

type ModalButtonProps = {
  label?: string;
  variant?: 'outlined' | 'cancel';
  onClick?: () => void;
  loading?: boolean;
};

/**
 * Returns a button to be used in the Modal Component
 *
 * @param {string} label - The message inside the button
 * @param {'outlined' | 'cancel'} variant - A set of styles
 * @param {Function} onClick - Function to be called when the button is clicked
 * @param {boolean} loading - Whether the button is in loading state
 *
 * @returns {ReactNode} - The Modal Button component
 */
export const ModalButton: FC<ModalButtonProps> = ({
  label,
  variant,
  onClick = () => {},
  loading = false,
}: ModalButtonProps): ReactNode => {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState<boolean>(false);

  const getPadding = (): string => {
    if (variant === 'outlined') {
      return '15px';
    }

    return '15px 30px';
  };

  const getBackgroundColor = (): string => {
    if (hovered) {
      if (variant === 'outlined') {
        return colors.secondary.greenMedium;
      }

      return colors.secondary.redHigh;
    }

    if (variant === 'outlined') {
      return 'transparent';
    }

    return colors.secondary.redMedium;
  };

  const getBorder = (): string => {
    if (hovered) {
      return `1px solid transparent`;
    }

    if (variant === 'outlined') {
      return `1px solid ${colors.background['03']}`;
    }

    return '1px solid transparent';
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        padding: getPadding(),
        backgroundColor: getBackgroundColor(),
        border: getBorder(),
        borderRadius: '12px',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      onClick={() => onClick()}
    >
      <div
        style={{
          visibility: loading ? 'hidden' : 'visible',
        }}
      >
        <Text weight={700} content={label} />
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner size={'16px'} variant={'primary'} />
        </div>
      )}
    </div>
  );
};
