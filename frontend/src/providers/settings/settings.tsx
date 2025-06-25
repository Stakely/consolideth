import { createContext, ReactNode, useContext } from 'react';
import { getSetting, SettingKey, SettingsContextType } from '@/providers';

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const env = import.meta.env;

  function _getSetting<T>(key: SettingKey): T {
    return getSetting<T>(env, key);
  }

  return (
    <SettingsContext.Provider value={{ get: _getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings() must be used within SettingsProvider');
  }

  return context;
};
