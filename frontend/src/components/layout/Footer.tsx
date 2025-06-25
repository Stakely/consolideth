import { FC } from 'react';
import { GithubButton, StakelyLogo, Text } from '@/components';

export const Footer: FC = () => {
  return (
    <div
      className={
        'w-full items-center content-center flex gap-20 bg-translucent'
      }
      style={{
        height: '50px',
      }}
    >
      <Text
        content={
          'Built by <l:https://stakely.io>Stakely</l> - <l: https://stakely.io/staking/ethereum-staking#how-to-stake>delegate ETH with us</l>'
        }
      />
      <StakelyLogo />
      <GithubButton size={30} />
    </div>
  );
};
