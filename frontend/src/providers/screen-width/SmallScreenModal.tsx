import { FC } from 'react';
import { useTheme } from '@/providers/theme-provider';
import { Modal, Text } from '@/components';

type SmallScreenModalProps = {
  isOpen: boolean;
};
export const SmallScreenModal: FC<SmallScreenModalProps> = ({ isOpen }) => {
  const { colors } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      width={'260px'}
      showCloseButton={false}
      icon={'mobile'}
      iconColor={colors.secondary.redMedium}
      title={'Small device detected'}
      titleColor={colors.secondary.redMedium}
    >
      <div className="w-full flex content-center items-center">
        <Text
          color={colors.background['02']}
          align={'center'}
          content={
            'This site is designed to be viewed on higher-resolution devices. To ensure usability, your screen should be at least 900 pixels in width.\n' +
            '\n' +
            'Please switch to a device with a larger display —preferably a desktop resolution— to use the application properly.'
          }
        />
      </div>
    </Modal>
  );
};
