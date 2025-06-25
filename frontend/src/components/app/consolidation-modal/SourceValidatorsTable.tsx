import { FC, useEffect, useState } from 'react';
import { Validator } from '@/providers';
import { Checkbox, Icon, Input, Table, Text, Tooltip } from '@/components';
import { shortenAddress } from '@/providers/utils.ts';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useTheme } from '@/providers/theme-provider';

type SourceValidatorsTableProps = {
  validators: Array<Validator>;
  checkedValidatorsIndex: Array<number>;
  onValidatorChecked: (checked: boolean, index: number) => void;
  tablePage?: number;
  onPageChange?: (page: number) => void;
  targetValidatorIndex: number | null;
};

export const SourceValidatorsTable: FC<SourceValidatorsTableProps> = ({
  validators,
  checkedValidatorsIndex,
  onValidatorChecked,
  tablePage,
  onPageChange,
  targetValidatorIndex,
}) => {
  const { address } = useAccount();
  const { colors } = useTheme();

  const [filter, setFilter] = useState<string>('');
  const [filteredValidators, setFilteredValidators] =
    useState<Array<Validator>>(validators);

  const filterValidators = () => {
    if (filter === '') {
      return setFilteredValidators(validators);
    }

    const filtered = validators.filter((v) => {
      if (v.pubkey.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }

      if (v.index.toString().toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }

      return false;
    });

    setFilteredValidators(filtered);
  };

  useEffect(() => {
    filterValidators();
  }, [validators, filter]);

  const isValidatorChecked = (index: number) => {
    return checkedValidatorsIndex.includes(index);
  };

  const isTargetValidator = (index: number) => {
    return index === targetValidatorIndex;
  };

  const columnsDefinition = [
    {
      label: 'Address',
      align: 'start',
      prop: 'pubkey',
      sortable: true,
      render: (v: Validator) => {
        return (
          <div className="flex items-center">
            {v.isconsolidable && isValidatorChecked(v.index) && (
              <>
                <Checkbox
                  isChecked={true}
                  onChange={(checked) => onValidatorChecked(checked, v.index)}
                  checkedColor={colors.secondary.greenMedium}
                  size={'18px'}
                />
                <Tooltip content={v.pubkey}>
                  <Text weight={700} content={shortenAddress(v.pubkey)} />
                </Tooltip>
              </>
            )}
            {v.isconsolidable &&
              !isValidatorChecked(v.index) &&
              !isTargetValidator(v.index) && (
                <>
                  <Checkbox
                    isChecked={false}
                    onChange={(checked) => onValidatorChecked(checked, v.index)}
                    checkedColor={colors.secondary.greenMedium}
                    size={'18px'}
                  />
                  <Tooltip content={v.pubkey}>
                    <Text content={shortenAddress(v.pubkey)} />
                  </Tooltip>
                </>
              )}
            {(!v.isconsolidable || isTargetValidator(v.index)) && (
              <div className={'flex gap-10'}>
                <Icon
                  name={'forbidden'}
                  size={'18px'}
                  color={colors.background['02']}
                />
                <Tooltip content={v.pubkey}>
                  <Text
                    content={shortenAddress(v.pubkey)}
                    color={colors.background['02']}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
    {
      label: 'Withdrawal',
      align: 'end',
      prop: 'index',
      sortable: false,
      render: (v: Validator) => {
        return (
          <Tooltip content={address}>
            <Text
              content={shortenAddress(address ?? '')}
              weight={isValidatorChecked(v.index) ? 700 : 400}
              color={
                v.isconsolidable
                  ? colors.background['00']
                  : colors.background['02']
              }
            />
          </Tooltip>
        );
      },
    },
    {
      label: 'Balance',
      align: 'end',
      prop: 'balance',
      sortable: true,
      render: (v: Validator) => {
        return (
          <Text
            content={`${Number(formatEther(BigInt(v.balance), 'gwei')).toFixed(4)} ETH`}
            weight={isValidatorChecked(v.index) ? 700 : 400}
            color={
              v.isconsolidable
                ? colors.secondary.greenMedium
                : colors.background['02']
            }
          />
        );
      },
    },
  ];

  return (
    <div className={'w-full flex-col gap-15'}>
      <Input
        icon={'research'}
        placeholder={'Search...'}
        variant={'secondary'}
        updateModel={(v) => setFilter(v)}
      />
      <Table
        data={filteredValidators}
        columns={columnsDefinition as unknown as never}
        itemsPerPage={5}
        currentPage={tablePage}
        onPageChange={onPageChange}
      />
    </div>
  );
};
