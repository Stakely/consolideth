import { FC, ReactNode } from 'react';
import { Checkbox as MUICheckbox, SvgIcon } from '@mui/material';
import { Pixel, useTheme } from '@/providers/theme-provider';
import { Flex, Text } from '@/components';

type CheckboxProps = {
  /** The label of the checkbox to be displayed */
  label?: string;

  /** Whether the checkbox state is checked */
  isChecked: boolean;

  /**  Callback to be called when the checkbox state changes */
  onChange: (checked: boolean) => void;

  /** The alt message when the label is hovered */
  alt?: string;

  /** Whether the checkbox is disabled */
  disabled?: boolean;

  /** Whether the checkbox is enabled but the label appears disabled */
  labelDisabled?: boolean;

  /** The color of the label to be displayed */
  labelColor?: string;

  /** The color of the checked box */
  checkedColor?: string;

  /** The size of the checkbox */
  size?: Pixel;
};

/**
 *  Returns a checkbox component
 */
export const Checkbox: FC<CheckboxProps> = ({
  isChecked,
  onChange,
  label,
  alt = '',
  disabled = false,
  labelDisabled = false,
  labelColor,
  checkedColor,
  size,
}: CheckboxProps): ReactNode => {
  const { colors } = useTheme();

  const CustomCheckedIcon = ({ fillPath }: { fillPath: string }) => (
    <SvgIcon viewBox="0 0 14 14" sx={{ fontSize: size ?? '24px' }}>
      <path
        d="M5.95026 9.56659C5.87365 9.56668 5.79777 9.55162 5.727 9.52229C5.65622 9.49296 5.59194 9.44993 5.53785 9.39567L3.67106 7.5292C3.56271 7.41961 3.50213 7.27158 3.50257 7.11747C3.503 6.96335 3.56441 6.81567 3.67339 6.70669C3.78236 6.59771 3.93004 6.53629 4.08415 6.53585C4.23827 6.53541 4.3863 6.59598 4.4959 6.70433L5.95025 8.15839L9.5044 4.60427C9.61402 4.49603 9.76201 4.43555 9.91607 4.43604C10.0701 4.43653 10.2177 4.49794 10.3267 4.60688C10.4356 4.71582 10.497 4.86343 10.4975 5.01748C10.498 5.17154 10.4375 5.31953 10.3292 5.42914L6.36268 9.39569C6.30859 9.44994 6.2443 9.49297 6.17353 9.5223C6.10275 9.55163 6.02688 9.56668 5.95026 9.56659Z"
        fill="white"
      />
      <path
        d="M12.2501 1.16602H1.75008C1.59537 1.16602 1.447 1.22747 1.3376 1.33687C1.22821 1.44627 1.16675 1.59464 1.16675 1.74935V12.2493C1.16675 12.4041 1.22821 12.5524 1.3376 12.6618C1.447 12.7712 1.59537 12.8327 1.75008 12.8327H12.2501C12.4048 12.8327 12.5532 12.7712 12.6626 12.6618C12.772 12.5524 12.8334 12.4041 12.8334 12.2493V1.74935C12.8334 1.59464 12.772 1.44627 12.6626 1.33687C12.5532 1.22747 12.4048 1.16602 12.2501 1.16602ZM10.3292 5.42851L6.36261 9.39506C6.30846 9.44924 6.24417 9.49222 6.1734 9.52154C6.10263 9.55086 6.02678 9.56596 5.95018 9.56596C5.87358 9.56596 5.79772 9.55086 5.72696 9.52154C5.65619 9.49222 5.59189 9.44924 5.53774 9.39506L3.671 7.52857C3.56264 7.41897 3.50206 7.27095 3.5025 7.11683C3.50294 6.96272 3.56435 6.81504 3.67332 6.70606C3.7823 6.59708 3.92997 6.53566 4.08409 6.53521C4.2382 6.53477 4.38623 6.59534 4.49583 6.70369L5.95018 8.15776L9.50433 4.60364C9.61395 4.4954 9.76194 4.43492 9.916 4.4354C10.0701 4.43589 10.2177 4.49731 10.3266 4.60624C10.4355 4.71518 10.4969 4.86279 10.4974 5.01685C10.4979 5.1709 10.4374 5.31889 10.3292 5.42851Z"
        fill={fillPath}
      />
    </SvgIcon>
  );

  const CustomUncheckedIcon = () => (
    <SvgIcon viewBox="0 0 14 14" sx={{ fontSize: size ?? '24px' }}>
      <path
        d="M12.2501 1.16602H1.75008C1.59537 1.16602 1.447 1.22747 1.3376 1.33687C1.22821 1.44627 1.16675 1.59464 1.16675 1.74935V12.2493C1.16675 12.4041 1.22821 12.5524 1.3376 12.6618C1.447 12.7712 1.59537 12.8327 1.75008 12.8327H12.2501C12.4048 12.8327 12.5532 12.7712 12.6626 12.6618C12.772 12.5524 12.8334 12.4041 12.8334 12.2493V1.74935C12.8334 1.59464 12.772 1.44627 12.6626 1.33687C12.5532 1.22747 12.4048 1.16602 12.2501 1.16602ZM11.6667 11.666H2.33341V2.33268H11.6667V11.666Z"
        fill="white"
      />
    </SvgIcon>
  );

  const getLabelColor = (): string => {
    if (disabled || labelDisabled) {
      return colors.background['03'];
    }

    if (labelColor) {
      return labelColor;
    }

    return colors.background['00'];
  };
  return (
    <Flex width={'100%'} direction={'row'} items={'center'}>
      <MUICheckbox
        icon={<CustomUncheckedIcon />}
        checkedIcon={
          <CustomCheckedIcon fillPath={checkedColor ?? colors.primary['02']} />
        }
        disabled={disabled}
        checked={isChecked}
        onChange={(e) => {
          if (disabled) {
            return;
          }
          onChange(e.target.checked);
        }}
        sx={{
          padding: '0px 10px 0px 0px',
          color: colors.background['00'],
          '&.Mui-checked': {
            color: colors.primary['02'],
            '& svg': {
              fill: 'white',
            },
          },

          '& .MuiTouchRipple-root': {
            color: colors.primary['02'],
          },
        }}
      />
      {label && (
        <div
          onClick={() => {
            onChange(!isChecked);
          }}
          style={{
            cursor: disabled || labelDisabled ? 'auto' : 'pointer',
          }}
        >
          <Text
            variant={'body2'}
            content={label}
            alt={alt}
            color={getLabelColor()}
          />
        </div>
      )}
    </Flex>
  );
};
