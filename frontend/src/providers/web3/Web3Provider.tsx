import { FC, ReactNode } from 'react';
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider as LibraryProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hoodi, mainnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { useSettings } from '@/providers';
import '@rainbow-me/rainbowkit/styles.css';
import { useTheme } from '@/providers/theme-provider';

const queryClient = new QueryClient();

type Web3ProviderProps = {
  children: ReactNode;
};

export const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  const { get } = useSettings();

  const config = getDefaultConfig({
    appName: 'Consolideth',
    chains: [hoodi, mainnet],
    projectId: get<string>('WALLET_CONNECT_PROJECT_ID'),
  });

  const rainbowTheme = darkTheme();
  const { colors } = useTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LibraryProvider
          theme={{
            ...rainbowTheme,
            fonts: {
              body: 'Plus Jakarta Sans',
            },
            colors: {
              ...rainbowTheme.colors,
              modalBackground: 'rgba(16, 21, 65, 0.5)',
              modalBorder: 'rgba(207, 206, 220, 0.20)',
              accentColor: colors.primary['02'],
              modalBackdrop: 'rgba(0, 0, 0, 0.30)',
              connectButtonBackground: 'rgba(255, 255, 255, 0.10)',
            },
            blurs: {
              modalOverlay: 'blur(10px)',
            },
            radii: {
              ...rainbowTheme.radii,
              connectButton: '12px',
            },
          }}
        >
          {children}
        </LibraryProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
