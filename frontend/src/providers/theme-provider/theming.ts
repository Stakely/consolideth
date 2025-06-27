import { Pixel, Rem } from '@/providers/theme-provider';

export type AppThemeColors = {
  primary: {
    '01': string;
    '02': string;
    '03': string;
  };
  secondary: {
    yellowHigh: string;
    yellowMedium: string;
    yellowLow: string;
    redHigh: string;
    redMedium: string;
    redLow: string;
    blueHigh: string;
    blueMedium: string;
    blueLow: string;
    greenHigh: string;
    greenMedium: string;
    greenLow: string;
    orangeLow: string;
    black: string;
  };
  background: {
    '00': string;
    '01': string;
    '02': string;
    '03': string;
    '04': string;
    '05': string;
    '06': string;
    '07': string;
  };
  transparent: string;
  input: string;
};

type Font = {
  size: Rem;
  weight: number;
  lineHeight: Rem;
  font: string;
};

export type AppThemeFonts = {
  h1: Font;
  h2: Font;
  h3: Font;
  body1: Font;
  body2: Font;
  littleBody: Font;
  largeKeyNumber: Font;
  mediumKeyNumber: Font;
  littleKeyNumber: Font;
  logo: Font;
};

export type BorderRadius = {
  button: Pixel;
  switch: Pixel;
  autocompleteSelect: Pixel;
  accordion: Pixel;
  surface: Pixel;
  select: Pixel;
  input: Pixel;
  toggle: Pixel;
};

export type Theme = {
  colors: AppThemeColors;
  fonts: AppThemeFonts;
  borderRadius: BorderRadius;
};
