import { ConnectWallet, Consolidation } from '@/pages';
import { useAccount } from 'wagmi';
import { ScreenWidthListener } from '@/providers/screen-width';
import { useEffect } from 'react';

type UmamiWindow = Window & {
  umami: {
    track: (str: string, args: Record<string, string>) => void;
  };
};

function App() {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      (window as unknown as UmamiWindow).umami.track('wallet_connected', {
        address: address,
      });
    }
  }, [isConnected]);
  return isConnected ? (
    <ScreenWidthListener>
      <Consolidation />
    </ScreenWidthListener>
  ) : (
    <ConnectWallet />
  );
}

export default App;
