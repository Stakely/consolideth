import { FC } from 'react';
import { Validator, ValidatorNodeStatus } from '@/providers';
import { shortenAddress } from '@/providers/utils.ts';
import { formatEther } from 'viem';
import { useTheme } from '@/providers/theme-provider';
import { Button, Icon, Table, Text, Tooltip } from '@/components';

type ValidatorTableProps = {
  validators: Array<Validator>;
  onUpgradeValidator: (validator: Validator) => void;
};

type ValidatorTableColumn = {
  balance: number;
  validator: number;
  publicKey: string;
  status: ValidatorNodeStatus;
  credType: string;
  actions?: {
    upgrade: () => void;
  };
};

export const ValidatorTable: FC<ValidatorTableProps> = ({
  validators,
  onUpgradeValidator,
}) => {
  const { colors } = useTheme();

  const statusToText = (status: ValidatorNodeStatus) => {
    if (status === 'deposit_required') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Deposit required'}
          />
        </div>
      );
    }

    if (status === 'activating') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Activating'}
          />
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Pending'}
          />
        </div>
      );
    }

    if (status === 'deposited') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'check'}
            size={'16px'}
            color={colors.secondary.greenMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.greenMedium}
            content={'Deposited'}
          />
        </div>
      );
    }

    if (status === 'exiting_online') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Exiting online'}
          />
        </div>
      );
    }

    if (status === 'exiting_offline') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Exiting offline'}
          />
        </div>
      );
    }

    if (status === 'active_online') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'check'}
            size={'16px'}
            color={colors.secondary.greenMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.greenMedium}
            content={'Active online'}
          />
        </div>
      );
    }

    if (status === 'active_offline') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.yellowMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.yellowMedium}
            content={'Active offline'}
          />
        </div>
      );
    }

    if (status === 'exited') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'logoutRounded'}
            size={'16px'}
            color={colors.secondary.redMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.redMedium}
            content={'Exited'}
          />
        </div>
      );
    }

    if (status === 'slashed') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.redMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.redMedium}
            content={'Slashed'}
          />
        </div>
      );
    }

    if (status === 'slashing_online') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.redMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.redMedium}
            content={'Slashing online'}
          />
        </div>
      );
    }

    if (status === 'slashing_offline') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.redMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.redMedium}
            content={'Slashing offline'}
          />
        </div>
      );
    }

    if (status === 'slashed_online') {
      return (
        <div className="flex gap-5 items-center">
          <Icon
            name={'exclamationMark'}
            size={'16px'}
            color={colors.secondary.redMedium}
          />
          <Text
            weight={700}
            color={colors.secondary.redMedium}
            content={'Slashed online'}
          />
        </div>
      );
    }

    return (
      <div className="flex gap-5 items-center">
        <Icon
          name={'exclamationMark'}
          size={'16px'}
          color={colors.secondary.redMedium}
        />
        <Text
          weight={700}
          color={colors.secondary.redMedium}
          content={'Slashed offline'}
        />
      </div>
    );
  };

  const columnsDefinition = [
    {
      label: 'Validator',
      align: 'start',
      prop: 'validator',
      sortable: false,
    },
    {
      label: 'Cred. type',
      align: 'start',
      prop: 'credType',
      sortable: true,
    },
    {
      label: 'Balance',
      align: 'start',
      prop: 'balance',
      sortable: true,
      render: (v: ValidatorTableColumn) => {
        return (
          <Text
            content={`${Number(formatEther(BigInt(v.balance), 'gwei')).toFixed(4)} ETH`}
          />
        );
      },
    },
    {
      label: 'Public key',
      align: 'start',
      prop: 'publicKey',
      sortable: false,
      render: (v: ValidatorTableColumn) => {
        return (
          <Tooltip content={v.publicKey}>
            <Text content={shortenAddress(v.publicKey)} />
          </Tooltip>
        );
      },
    },
    {
      label: 'Status',
      align: 'end',
      prop: 'status',
      sortable: true,
      render: (v: ValidatorTableColumn) => {
        return statusToText(v.status);
      },
    },
    {
      label: 'Actions',
      align: 'end',
      prop: 'actions',
      render: (v: ValidatorTableColumn) => {
        return (
          <Button
            outlined
            disabled={!v.actions?.upgrade}
            reduced
            borderColor={
              v.actions ? colors.background['00'] : colors.background['03']
            }
            textColor={
              v.actions ? colors.background['00'] : colors.background['03']
            }
            label={'Upgrade'}
            onClick={() => v.actions?.upgrade?.()}
          />
        );
      },
    },
  ];

  const validatorColumns: Array<ValidatorTableColumn> = validators.map((v) => {
    return {
      status: v.status,
      validator: v.index,
      balance: v.balance,
      publicKey: v.pubkey,
      credType: v.credtype,
      actions:
        v.credtype === '01' && v.isconsolidable
          ? {
              upgrade: () => onUpgradeValidator(v),
            }
          : undefined,
    };
  });

  return (
    <Table
      columns={columnsDefinition as unknown as never}
      data={validatorColumns}
      itemsPerPage={7}
    />
  );
};
