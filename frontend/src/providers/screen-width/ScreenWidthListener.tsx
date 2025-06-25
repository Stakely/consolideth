import { FC, ReactNode } from 'react';
import { useIsMobile } from '@/components';
import { SmallScreenModal } from '@/providers/screen-width/SmallScreenModal.tsx';

export const ScreenWidthListener: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile(900);

  return (
    <>
      {children}
      <SmallScreenModal isOpen={isMobile} />
    </>
  );
};
