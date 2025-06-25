import { createContext, FC, ReactNode, useContext } from 'react';
import { Theme } from './theming';
import { StakelyTheme } from './design-system';

const ThemeContext = createContext<Theme | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  theme?: Theme;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  theme: customTheme,
}) => {
  const theme = customTheme ? customTheme : StakelyTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme() must be used within ThemeProvider');
  }

  return theme;
};
