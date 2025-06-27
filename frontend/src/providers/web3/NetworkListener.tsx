import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { hoodi, mainnet } from 'viem/chains';
import { WrongNetworkDialog } from '@/components';

type NetworkContextType = {
  selectedChain: 'ethereum' | 'hoodi';
  setSelectedChain: (chain: 'ethereum' | 'hoodi') => void;
};

const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('network');
  const network = name === 'hoodi' ? 'hoodi' : 'ethereum';

  const [showWrongNetworkDialog, setShowWrongNetworkDialog] =
    useState<boolean>(false);
  const { switchChain } = useSwitchChain();
  const { chainId } = useAccount();
  const [selectedChain, setSelectedChain] = useState<'ethereum' | 'hoodi'>(
    network
  );

  const chainMap = {
    ethereum: mainnet,
    hoodi: hoodi,
  };

  const changeSelectedChain = (newVal: 'ethereum' | 'hoodi') => {
    const newNetwork = newVal === 'hoodi' ? 'hoodi' : 'mainnet';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('network', newNetwork);
    window.history.replaceState(null, '', newUrl.toString());

    setSelectedChain(newVal);
  };

  useEffect(() => {
    if (!!chainId && chainId !== chainMap[selectedChain].id) {
      setShowWrongNetworkDialog(true);
    } else {
      setShowWrongNetworkDialog(false);
    }

    if (selectedChain === 'hoodi') {
      switchChain({ chainId: hoodi.id });
      return;
    }

    switchChain({ chainId: mainnet.id });
  }, [selectedChain, chainId]);

  return (
    <NetworkContext.Provider
      value={{
        selectedChain,
        setSelectedChain: changeSelectedChain,
      }}
    >
      {children}
      <WrongNetworkDialog
        isOpen={showWrongNetworkDialog}
        selectedNetwork={selectedChain}
      />
    </NetworkContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork() must be used within Web3Provider');
  }

  return context;
};
