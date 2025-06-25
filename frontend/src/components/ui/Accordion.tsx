import { FC, useState } from 'react';
import { Icon, Text } from '@/components';

type AccordionProps = {
  title: string;
  content: string;
};

export const Accordion: FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isHover, setHover] = useState<boolean>(false);

  const getBackground = () => {
    if (isOpen || isHover) {
      return 'bg-accordion-open';
    }

    return 'bg-accordion-closed';
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setOpen((prev) => !prev)}
      className={`w-full flex ${isOpen ? '' : 'items-center'} p-x-7 p-y-15 br-3 transition-300 ${getBackground()} cursor-pointer gap-15`}
    >
      <Icon name={'rightArrow'} size={'18px'} rotation={isOpen ? 90 : 0} />
      <div className={`flex-col w-full transition-300`}>
        <Text variant={'body2'} weight={700} content={title} />
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isOpen ? '600px' : '0px',
            transition: 'all 300ms ease-in-out',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            style={{
              paddingTop: '15px',
            }}
          >
            <Text variant={'littleBody'} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};
