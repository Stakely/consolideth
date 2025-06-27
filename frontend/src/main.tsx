import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {
  Web3Provider,
  SettingsProvider,
  NetworkProvider,
  AccountValidatorsProvider,
  injectUmamiScript,
} from '@/providers';
import { ThemeProvider } from '@/providers/theme-provider';

injectUmamiScript();

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <SettingsProvider>
      <Web3Provider>
        <NetworkProvider>
          <AccountValidatorsProvider>
            <App />
          </AccountValidatorsProvider>
        </NetworkProvider>
      </Web3Provider>
    </SettingsProvider>
  </ThemeProvider>
);
