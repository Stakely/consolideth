import { Cross } from '@/components/ui/icons/Cross.tsx';
import { LogoIcon } from '@/components/ui/icons/LogoIcon.tsx';
import { MobileIcon } from '@/components/ui/icons/MobileIcon.tsx';
import { HideIcon } from '@/components/ui/icons/HideIcon.tsx';
import { EyeIcon } from '@/components/ui/icons/EyeIcon.tsx';
import { ResearchIcon } from '@/components/ui/icons/ResearchIcon.tsx';
import { FireIcon } from '@/components/ui/icons/FireIcon.tsx';
import { RightArrowIcon } from '@/components/ui/icons/RightArrowIcon.tsx';
import { LeftArrowIcon } from '@/components/ui/icons/LeftArrowIcon.tsx';
import { RightArrowCircleIcon } from '@/components/ui/icons/RightArrowCircleIcon.tsx';
import { ArrowsIcon } from '@/components/ui/icons/ArrowsIcon.tsx';
import { ExclamationMarkIcon } from '@/components/ui/icons/ExclamationMarkIcon.tsx';
import { CheckIcon } from '@/components/ui/icons/CheckIcon.tsx';
import { LogoutRoundedIcon } from '@/components/ui/icons/LogoutRoundedIcon.tsx';
import { BrokenChainIcon } from '@/components/ui/icons/BrokenChainIcon.tsx';
import { ReloadIcon } from '@/components/ui/icons/ReloadIcon.tsx';
import { CopyIcon } from '@/components/ui/icons/CopyIcon.tsx';
import { ArrowUpRightIcon } from '@/components/ui/icons/ArrowUpRightIcon.tsx';
import { ForbiddenIcon } from '@/components/ui/icons/ForbiddenIcon.tsx';
import { ArrowsHorizontalIcon } from '@/components/ui/icons/ArrowsHorizontalIcon.tsx';

export const icons = {
  cross: Cross,
  logo: LogoIcon,
  mobile: MobileIcon,
  hide: HideIcon,
  eye: EyeIcon,
  research: ResearchIcon,
  fire: FireIcon,
  rightArrow: RightArrowIcon,
  leftArrow: LeftArrowIcon,
  rightArrowCircle: RightArrowCircleIcon,
  arrows: ArrowsIcon,
  exclamationMark: ExclamationMarkIcon,
  check: CheckIcon,
  logoutRounded: LogoutRoundedIcon,
  brokenChain: BrokenChainIcon,
  reload: ReloadIcon,
  copy: CopyIcon,
  arrowUpRight: ArrowUpRightIcon,
  forbidden: ForbiddenIcon,
  arrowsHorizontal: ArrowsHorizontalIcon,
};

export type Icon = keyof typeof icons;
