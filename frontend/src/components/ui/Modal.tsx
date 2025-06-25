import { FC, ReactNode, useState } from 'react';
import {
  Backdrop,
  Dialog as MUIModal,
  DialogContent,
  styled,
} from '@mui/material';
import { Icon as IconType } from './icons/icons.tsx';
import { getRgba, Pixel, useTheme } from '@/providers/theme-provider';
import { Fade, Flex, Icon, Text } from '@/components';
import { ModalButton } from './ModalButton.tsx';

type ModalProps = {
  /**
   * Title displayed at the top of the modal.
   * Optional — if not provided, no title will be shown.
   */
  title?: string;

  /**
   * Color of the title text.
   * Accepts any valid CSS color value or a value from the theme.
   */
  titleColor?: string;

  /**
   * Whether the modal is open or not.
   * When true, the modal is rendered and visible to the user.
   */
  isOpen?: boolean;

  /**
   * Function to be called when the modal is requested to close (e.g., via backdrop click or ESC key).
   */
  onClose?: () => void;

  /**
   * Optional icon displayed above the modal content.
   * Helps provide visual context to the modal’s purpose.
   */
  icon?: IconType;

  /**
   * Color of the icon displayed at the top of the modal.
   * Accepts any valid CSS color value or a value from the theme.
   */
  iconColor?: string;

  /**
   * Text label for the cancel/close button.
   * If empty, the button will not be rendered.
   */
  closeButtonText?: string;

  /**
   * Text label for the accept/confirm button.
   * If empty, the button will not be rendered.
   */
  acceptButtonText?: string;

  /**
   * Function to be executed when the accept button is clicked.
   */
  onAccept?: () => void;

  /**
   * Function to be executed when the cancel button is clicked.
   */
  onCancel?: () => void;

  /**
   * Whether the accept button is in a loading state.
   * Displays a spinner and disables interactions when true.
   */
  isButtonLoading?: boolean;

  /**
   * Width of the modal in pixels.
   * Accepts any string value with a valid CSS unit (e.g., '400px').
   */
  width?: Pixel;

  /**
   * Reverses the visual variant of the buttons.
   * Applies the "cancel" style to the accept button and "outlined" to the cancel button.
   */
  reverseButtons?: boolean;

  /**
   * Shows a close button in the top-right corner.
   */
  showCloseButton?: boolean;

  /**
   * Modal content to be displayed inside the dialog.
   * Can include text, form fields, or any React nodes.
   */
  children: ReactNode;

  /**
   * The background color of the modal
   */
  backgroundColor?: string;

  /**
   * The opacity of the modal
   */

  opacity?: number;
};

const CustomBackdrop = styled(Backdrop)({
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(0, 0, 0, 0.10)',
});

/**
 * Returns a modal component.
 * This component show its content in front of the app to provide
 * critical information or ask for a decision.
 */
export const Modal: FC<ModalProps> = ({
  title = '',
  isOpen = false,
  icon,
  iconColor,
  titleColor,
  onClose = () => {},
  onAccept = () => {},
  onCancel = () => {},
  isButtonLoading = false,
  closeButtonText = '',
  acceptButtonText = '',
  width = '422px',
  children,
  reverseButtons = false,
  showCloseButton = true,
  backgroundColor,
  opacity,
}: ModalProps): ReactNode => {
  const { colors } = useTheme();
  const [isCloseHover, setCloseHover] = useState<boolean>(false);

  const backgroundColorRGBA = () => {
    const origin = backgroundColor ?? '#10154180';
    return getRgba(origin, opacity ?? 0.5);
  };
  return (
    <MUIModal
      open={isOpen}
      onClose={() => onClose()}
      slots={{ backdrop: CustomBackdrop }}
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          borderRadius: '20px',
          maxWidth: 'none',
        },
      }}
    >
      <DialogContent
        sx={{
          padding: '40px',
          border: '1px solid rgba(207, 206, 220, 0.20)',
          boxShadow: 0,
          borderRadius: '20px',
          backgroundColor: 'transparent',
          background: backgroundColorRGBA(),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: width,
          margin: 'auto',
          backdropFilter: 'blur(25px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: '30px',
            position: 'relative',
          }}
        >
          {showCloseButton && (
            <div
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
              }}
            >
              <Icon
                name={'cross'}
                size={'12px'}
                clickable={true}
                onClick={() => {
                  setCloseHover(false);
                  onClose();
                }}
                color={
                  isCloseHover
                    ? colors.secondary.redMedium
                    : colors.background['00']
                }
              />
            </div>
          )}
          {icon && (
            <Icon
              name={icon}
              size={'30px'}
              color={iconColor ?? colors.background['00']}
            />
          )}
          {title && (
            <Text
              content={title}
              color={titleColor ?? colors.background['00']}
              variant={'h3'}
              weight={700}
            />
          )}
          <Fade isVisible={isOpen}>{children}</Fade>
          <Flex direction={'row'} width={'100%'} content={'space-between'}>
            {closeButtonText && (
              <Flex width={'100%'} items={'center'}>
                <ModalButton
                  variant={reverseButtons ? 'outlined' : 'cancel'}
                  onClick={() => onCancel()}
                  label={closeButtonText}
                />
              </Flex>
            )}
            {acceptButtonText && (
              <Flex width={'100%'} items={'center'}>
                <ModalButton
                  variant={reverseButtons ? 'cancel' : 'outlined'}
                  onClick={() => onAccept()}
                  label={acceptButtonText}
                  loading={isButtonLoading}
                />
              </Flex>
            )}
          </Flex>
        </div>
      </DialogContent>
    </MUIModal>
  );
};
