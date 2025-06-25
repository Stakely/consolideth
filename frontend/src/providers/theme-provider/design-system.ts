import { BorderRadius, Theme } from './theming';
import { Rem } from '@/providers/theme-provider';

export const StakelyPalette = {
  // Primary
  primary_navy: '#213D96',
  primary_orange: '#FF7748',
  primary_eggWhite: '#FAF2ED',

  // Secondary
  secondary_yellowHigh: '#F59D1F',
  secondary_yellowMedium: '#F7C174',
  secondary_yellowLow: '#FAEEDE',
  secondary_redHigh: '#F31715',
  secondary_redMedium: '#F75D5C',
  secondary_redLow: '#FFD3D3',
  secondary_blueHigh: '#0B8EE5',
  secondary_blueMedium: '#4FB4F7',
  secondary_blueLow: '#CFECFF',
  secondary_greenHigh: '#07892D',
  secondary_greenMedium: '#4DBE6E',
  secondary_greenLow: '#D7FFE2',
  secondary_orangeLow: '#FAE8DE',
  secondary_black: '#000000',

  // Background
  background_00: '#FFFFFF',
  background_01: '#E4E0E4',
  background_02: '#CFCEDC',
  background_03: '#8994B7',
  background_04: '#1B3382',
  background_05: '#14296F',
  background_06: '#0D1847',
  background_07: '#2F3568',
  background_header: '#131737',
  background_surface: '#101541',
  background_onboarding_02: '#21275D',
  transparent: 'transparent',

  input: 'rgba(33, 61, 150, 0.40)',
};

export const StakelyFonts: Record<string, [Rem, number, Rem, string]> = {
  h1: ['3rem', 700, '3.78rem', 'Plus Jakarta Sans'],
  h2: ['1.75rem', 700, '2.2rem', 'Plus Jakarta Sans'],
  h3: ['1.25rem', 700, '1.575rem', 'Plus Jakarta Sans'],
  body: ['1rem', 400, '1.26rem', 'Plus Jakarta Sans'],
  body2: ['0.875rem', 400, '1.103rem', 'Plus Jakarta Sans'],
  littleBody: ['0.813rem', 400, '1rem', 'Plus Jakarta Sans'],
  largeKeyNumber: ['1.625rem', 600, '2.047rem', 'Plus Jakarta Sans'],
  mediumKeyNumber: ['1.25rem', 800, '1.575rem', 'Plus Jakarta Sans'],
  littleKeyNumber: ['0.813rem', 800, '1.024rem', 'Plus Jakarta Sans'],
  logo: ['1.563rem', 700, '1.969rem', 'Plus Jakarta Sans'],
};

export const StakelyBorderRadius: BorderRadius = {
  button: '19.4px',
  switch: '13px',
  autocompleteSelect: '12px',
  accordion: '12px',
  surface: '20px',
  select: '12px',
  input: '12px',
  toggle: '35px',
};

export const StakelyTheme: Theme = {
  colors: {
    primary: {
      '01': StakelyPalette.primary_navy,
      '02': StakelyPalette.primary_orange,
      '03': StakelyPalette.primary_eggWhite,
    },
    secondary: {
      yellowHigh: StakelyPalette.secondary_yellowHigh,
      yellowMedium: StakelyPalette.secondary_yellowMedium,
      yellowLow: StakelyPalette.secondary_yellowLow,
      redHigh: StakelyPalette.secondary_redHigh,
      redMedium: StakelyPalette.secondary_redMedium,
      redLow: StakelyPalette.secondary_redLow,
      blueHigh: StakelyPalette.secondary_blueHigh,
      blueMedium: StakelyPalette.secondary_blueMedium,
      blueLow: StakelyPalette.secondary_blueLow,
      greenHigh: StakelyPalette.secondary_greenHigh,
      greenMedium: StakelyPalette.secondary_greenMedium,
      greenLow: StakelyPalette.secondary_greenLow,
      orangeLow: StakelyPalette.secondary_orangeLow,
      black: StakelyPalette.secondary_black,
    },
    background: {
      '00': StakelyPalette.background_00,
      '01': StakelyPalette.background_01,
      '02': StakelyPalette.background_02,
      '03': StakelyPalette.background_03,
      '04': StakelyPalette.background_04,
      '05': StakelyPalette.background_05,
      '06': StakelyPalette.background_06,
      '07': StakelyPalette.background_07,
    },
    transparent: StakelyPalette.transparent,
    input: StakelyPalette.input,
  },
  fonts: {
    h1: {
      size: StakelyFonts.h1[0],
      weight: StakelyFonts.h1[1],
      lineHeight: StakelyFonts.h1[2],
      font: StakelyFonts.h1[3],
    },
    h2: {
      size: StakelyFonts.h2[0],
      weight: StakelyFonts.h2[1],
      lineHeight: StakelyFonts.h2[2],
      font: StakelyFonts.h2[3],
    },
    h3: {
      size: StakelyFonts.h3[0],
      weight: StakelyFonts.h3[1],
      lineHeight: StakelyFonts.h3[2],
      font: StakelyFonts.h3[3],
    },
    body1: {
      size: StakelyFonts.body[0],
      weight: StakelyFonts.body[1],
      lineHeight: StakelyFonts.body[2],
      font: StakelyFonts.body[3],
    },
    body2: {
      size: StakelyFonts.body2[0],
      weight: StakelyFonts.body2[1],
      lineHeight: StakelyFonts.body2[2],
      font: StakelyFonts.body2[3],
    },
    littleBody: {
      size: StakelyFonts.littleBody[0],
      weight: StakelyFonts.littleBody[1],
      lineHeight: StakelyFonts.littleBody[2],
      font: StakelyFonts.littleBody[3],
    },
    largeKeyNumber: {
      size: StakelyFonts.largeKeyNumber[0],
      weight: StakelyFonts.largeKeyNumber[1],
      lineHeight: StakelyFonts.largeKeyNumber[2],
      font: StakelyFonts.largeKeyNumber[3],
    },
    mediumKeyNumber: {
      size: StakelyFonts.mediumKeyNumber[0],
      weight: StakelyFonts.mediumKeyNumber[1],
      lineHeight: StakelyFonts.mediumKeyNumber[2],
      font: StakelyFonts.mediumKeyNumber[3],
    },
    littleKeyNumber: {
      size: StakelyFonts.littleKeyNumber[0],
      weight: StakelyFonts.littleKeyNumber[1],
      lineHeight: StakelyFonts.littleKeyNumber[2],
      font: StakelyFonts.littleKeyNumber[3],
    },
    logo: {
      size: StakelyFonts.logo[0],
      weight: StakelyFonts.logo[1],
      lineHeight: StakelyFonts.logo[2],
      font: StakelyFonts.logo[3],
    },
  },
  borderRadius: StakelyBorderRadius,
};

export const getRgb = (color: string): { r: number; g: number; b: number } => {
  let hex = color.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

export const getRgba = (color: string, opacity: number): string => {
  let hex = color.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
