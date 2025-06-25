import { FC } from 'react';
import { useTheme } from '@/providers/theme-provider';

export const Logo: FC = () => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        fontFamily: 'Plus Jakarta Sans',
        fontSize: '40px',
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          color: colors.background['00'],
        }}
      >
        Consolid
      </span>
      <span
        style={{
          color: colors.primary['02'],
        }}
      >
        eth.
      </span>
    </div>
  );
};
