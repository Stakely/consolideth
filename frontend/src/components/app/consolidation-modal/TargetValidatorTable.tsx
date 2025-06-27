import { Validator } from '@/providers';
import { FC, useEffect, useState } from 'react';
import { Input, Table, Text, Tooltip } from '@/components';
import { shortenAddress } from '@/providers/utils.ts';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { useTheme } from '@/providers/theme-provider';

type TargetValidatorTableProps = {
  validators: Array<Validator>;
  selectedValidatorIndex: number | null;
  setSelectedValidatorIndex: (index: number | null) => void;
  tablePage?: number;
  onPageChange?: (page: number) => void;
};

export const TargetValidatorTable: FC<TargetValidatorTableProps> = ({
  validators,
  selectedValidatorIndex,
  setSelectedValidatorIndex,
  tablePage,
  onPageChange,
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

  const columnsDefinition = [
    {
      label: 'Address',
      align: 'start',
      prop: 'pubkey',
      sortable: true,
      render: (v: Validator) => {
        return (
          <div className={'p-x-7'}>
            <Tooltip content={v.pubkey}>
              <Text
                weight={400}
                content={shortenAddress(v.pubkey)}
                color={
                  v.isconsolidable
                    ? colors.background['00']
                    : colors.background['03']
                }
              />
            </Tooltip>
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
              weight={400}
              color={
                v.isconsolidable
                  ? colors.background['00']
                  : colors.background['03']
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
          <div className={'p-x-7'}>
            <Text
              content={`${Number(formatEther(BigInt(v.balance), 'gwei')).toFixed(4)} ETH`}
              weight={400}
              color={
                v.index === selectedValidatorIndex
                  ? colors.background['00']
                  : v.isconsolidable
                    ? colors.secondary.greenMedium
                    : colors.background['03']
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex-col gap-15">
      <Input
        icon={'research'}
        placeholder={'Search...'}
        variant={'secondary'}
        updateModel={(v) => setFilter(v)}
      />
      <Table
        data={filteredValidators}
        columns={columnsDefinition as never}
        itemsPerPage={5}
        isRowSelectable={(row: Validator) => row.isconsolidable}
        selectedColor={colors.secondary.greenMedium}
        onSelect={(v) => setSelectedValidatorIndex(v.index)}
        isRowSelected={(v) => v.index === selectedValidatorIndex}
        currentPage={tablePage}
        onPageChange={onPageChange}
      />
    </div>
  );
};
