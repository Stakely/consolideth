import { FC } from 'react';
import { useSwitchChain } from 'wagmi';
import { hoodi, mainnet } from 'viem/chains';
import { useTheme } from '@/providers/theme-provider';
import { Button, Modal, Text } from '@/components';

export const WrongNetworkDialog: FC<{
  isOpen: boolean;
  selectedNetwork: string;
}> = ({ isOpen, selectedNetwork }) => {
  const { colors } = useTheme();
  const { switchChain } = useSwitchChain();

  const getNetworkName = () => {
    if (selectedNetwork === 'ethereum') {
      return 'Ethereum Mainnet';
    }

    return 'Hoodi Testnet';
  };

  const onSwitchClicked = () => {
    if (selectedNetwork === 'ethereum') {
      switchChain({ chainId: mainnet.id });
      return;
    }

    switchChain({ chainId: hoodi.id });
  };

  return (
    <Modal
      icon={'brokenChain'}
      iconColor={colors.secondary.redMedium}
      title={'Wrong network'}
      titleColor={colors.secondary.redMedium}
      isOpen={isOpen}
      showCloseButton={false}
    >
      {' '}
      <div className="flex-col content-center items-center gap-30">
        <Text
          color={colors.background['02']}
          align={'center'}
          content={`The application is configured to be used on the <b>${getNetworkName()}</b> network. Please switch the active network in your wallet manager to <b>${getNetworkName()}</b> to continue.`}
        />
        <Button
          label={`Switch to ${getNetworkName()}`}
          onClick={() => onSwitchClicked()}
        />
      </div>
    </Modal>
  );
};
