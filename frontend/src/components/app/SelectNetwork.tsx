import { FC } from 'react';
import { useNetwork } from '@/providers';
import { Tabs } from '@/components';
import { useTheme } from '@/providers/theme-provider';

export const SelectNetwork: FC = () => {
  const { setSelectedChain, selectedChain } = useNetwork();

  type UmamiWindow = Window & {
    umami: {
      track: (str: string, args: Record<string, string>) => void;
    };
  };

  const { colors } = useTheme();
  return (
    <Tabs
      selectedTab={selectedChain === 'hoodi' ? 1 : 0}
      activeBgColor={colors.background['00']}
      activeColor={colors.primary['01']}
      inactiveColor={colors.background['02']}
      borderColor={colors.background['00']}
      tabs={['Ethereum Mainnet', 'Hoodi Testnet']}
      onChange={(idx) => {
        (window as unknown as UmamiWindow).umami.track('Change network', {
          network: idx === 0 ? 'ethereum' : 'hoodi',
        });
        if (idx === 0) {
          setSelectedChain('ethereum');
          return;
        }

        return setSelectedChain('hoodi');
      }}
    />
  );
};
