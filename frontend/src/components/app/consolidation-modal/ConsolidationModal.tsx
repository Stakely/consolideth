import { FC, useEffect, useState } from 'react';
import {
  Payload,
  UpgradeValidatorResponse,
  useAccountValidators,
  useNetwork,
  useSettings,
  Validator,
} from '@/providers';
import {
  Button,
  ErrorMessage,
  Icon,
  IconButton,
  Modal,
  Spinner,
  SuccessIcon,
  SuccessMessage,
  Text,
  Tooltip,
} from '@/components';
import { Stepper } from '@/components';
import { shortenAddress } from '@/providers/utils.ts';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useTheme } from '@/providers/theme-provider';
import { SourceValidatorsTable } from '@/components/app/consolidation-modal/SourceValidatorsTable.tsx';
import { TargetValidatorTable } from '@/components/app/consolidation-modal/TargetValidatorTable.tsx';

type ConsolidationModalProps = {
  isOpen: boolean;
  validators: Array<Validator>;
  onClose: () => void;
};

type UmamiWindow = Window & {
  umami: {
    track: (str: string, args: Record<string, string>) => void;
  };
};

export const ConsolidationModal: FC<ConsolidationModalProps> = ({
  isOpen,
  validators,
  onClose,
}) => {
  const { colors } = useTheme();
  const { get } = useSettings();
  const { selectedChain } = useNetwork();
  const { consolidateValidators } = useAccountValidators();
  const { address } = useAccount();
  const {
    status: txStatus,
    sendTransaction,
    data: hash,
    error,
  } = useSendTransaction();
  const { isLoading: isConfirmingTx } = useWaitForTransactionReceipt();

  const [isApiRequestLoading, setApiRequestLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Array<Payload>>([]);
  const [sourceValidatorsIndex, setSourceValidatorsIndex] = useState<
    Array<number>
  >([]);

  const [targetValidatorIndex, setTargetValidatorIndex] = useState<
    number | null
  >(null);

  const [activeTransaction, setActiveTransaction] = useState<number>(0);

  const [sourceTablePage, setSourceTablePage] = useState<number>(1);
  const [targetTablePage, setTargetTablePage] = useState<number>(1);

  useEffect(() => {
    if (!targetValidatorIndex) {
      return;
    }

    if (sourceValidatorsIndex.includes(targetValidatorIndex)) {
      setSourceValidatorsIndex((prev) =>
        prev.filter((i) => i !== targetValidatorIndex)
      );
    }
  }, [targetValidatorIndex]);

  useEffect(() => {
    if (txStatus !== 'success') {
      return;
    }

    const eventName = `${selectedChain}_consolidation`;
    (window as unknown as UmamiWindow).umami.track(eventName, {
      tx: JSON.stringify(transactions[activeTransaction].payload),
      wallet: address ?? '',
      hash,
    });
  }, [txStatus]);

  const onValidatorChecked = (checked: boolean, index: number) => {
    if (checked) {
      setSourceValidatorsIndex((prev) => [...prev, index]);
      return;
    }

    setSourceValidatorsIndex((prev) => prev.filter((i) => i !== index));
  };

  const onConsolidateClicked = () => {
    const targetValidatorAddress = validators.find(
      (v) => v.index === targetValidatorIndex
    )?.pubkey;
    const sourceValidatorsAddresses = validators
      .filter((v) => sourceValidatorsIndex.includes(v.index))
      .map((v) => v.pubkey);

    if (!targetValidatorAddress) {
      return;
    }

    setApiRequestLoading(true);
    consolidateValidators(
      targetValidatorAddress,
      sourceValidatorsAddresses,
      onConsolidateSuccess,
      onConsolidateError
    );
  };

  const onConsolidateSuccess = (response: UpgradeValidatorResponse) => {
    setApiRequestLoading(false);
    setTransactions(response.payloads);
  };

  const onConsolidateError = (error: string) => {
    console.log(error);
  };

  const getStep = () => {
    if (transactions.length === 0) {
      return 1;
    }

    if (activeTransaction === transactions.length) {
      return 3;
    }

    return 2;
  };

  const getPayloadMessage = (payload: Payload) => {
    // Upgrade validator
    if (
      !payload.sourcePubkey ||
      payload.sourcePubkey === payload.targetPubkey
    ) {
      return `Update credentials to 0x02 to ${shortenAddress(payload.targetPubkey)} validator`;
    }

    // Source to Target
    if (!payload.isConversionTx && !payload.isSelfConsolidation) {
      return `Consolidate validator ${shortenAddress(payload.sourcePubkey)} into ${shortenAddress(payload.targetPubkey)}`;
    }

    return '';
  };

  const handleClose = () => {
    setSourceValidatorsIndex([]);
    setTransactions([]);
    setTargetValidatorIndex(null);
    setApiRequestLoading(false);
    setActiveTransaction(0);
    setSourceTablePage(1);
    setTargetTablePage(1);

    onClose();
  };

  const Step1 = () => {
    return (
      <div className={'w-full flex-col gap-15 items-center'}>
        <div
          className="w-full flex"
          style={{
            width: '900px',
          }}
        >
          <div className="w-45 flex-col gap-15">
            <Text variant={'h3'} content={'Source Validators'} />
            <Text
              variant={'body2'}
              color={colors.background['02']}
              content={
                'Select one, some or all validators to be merged into another'
              }
            />
            <SourceValidatorsTable
              validators={validators}
              checkedValidatorsIndex={sourceValidatorsIndex}
              onValidatorChecked={onValidatorChecked}
              onPageChange={(p) => setSourceTablePage(p)}
              tablePage={sourceTablePage}
              targetValidatorIndex={targetValidatorIndex}
            />
          </div>
          <div className="w-10 flex-col items-center content-center">
            <div
              className="flex items-center content-center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(77, 190, 110, 1)',
              }}
            >
              <Icon
                name={'arrowUpRight'}
                rotation={45}
                size={'25px'}
                color={colors.background['00']}
              />
            </div>
          </div>
          <div className="w-45 flex-col gap-15">
            <Text variant={'h3'} content={'Target Validators'} />
            <Text
              variant={'body2'}
              color={colors.background['02']}
              content={'Select one validator to receive the merged balance'}
            />
            <TargetValidatorTable
              validators={validators}
              selectedValidatorIndex={targetValidatorIndex}
              setSelectedValidatorIndex={(index: number | null) => {
                setTargetValidatorIndex(index);
              }}
              onPageChange={(p) => setTargetTablePage(p)}
              tablePage={targetTablePage}
            />
          </div>
        </div>
        <div className="w-full flex content-end">
          <Button
            label={'Submit'}
            loading={isApiRequestLoading}
            onClick={onConsolidateClicked}
            background={
              !targetValidatorIndex || sourceValidatorsIndex.length === 0
                ? colors.background['03']
                : colors.secondary.greenMedium
            }
            disabled={
              !targetValidatorIndex || sourceValidatorsIndex.length === 0
            }
          />
        </div>
      </div>
    );
  };

  const Step2 = () => {
    if (transactions.length === 0) {
      return;
    }

    const getStepName = () => {
      return transactions.map((t) => t.description);
    };

    const onSendTxClicked = () => {
      sendTransaction(transactions[activeTransaction].payload);
    };

    const onCopyClicked = (str: string) => {
      navigator.clipboard.writeText(str);
    };

    const onSeeInExplorerClicked = (hash: string) => {
      const explorerUrl = get<string>(
        selectedChain === 'hoodi' ? 'HOODI_EXPLORER_URL' : 'EXPLORER_URL'
      );
      const transactionUrl = `${explorerUrl}/${hash}`;

      window.open(transactionUrl, '_blank');
    };

    return (
      <div className="w-full flex-col gap-30 items-center">
        <div
          style={{
            width: '700px',
            overflowX: 'auto',
            display: 'flex',
            whiteSpace: 'nowrap',
            paddingBottom: '20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Stepper steps={getStepName()} activeStepIndex={activeTransaction} />
        </div>
        <Text
          variant={'h2'}
          content={`Confirm transaction ${activeTransaction + 1}/${transactions.length}`}
        />
        <Text
          color={colors.background['02']}
          content={getPayloadMessage(transactions[activeTransaction])}
        />
        <Button
          label={'Send transaction'}
          background={
            txStatus === 'idle' || txStatus === 'error'
              ? colors.secondary.greenMedium
              : colors.background['03']
          }
          onClick={onSendTxClicked}
          disabled={txStatus !== 'idle' && txStatus !== 'error'}
        />
        {txStatus === 'pending' && !isConfirmingTx && (
          <Text
            variant={'body2'}
            color={colors.secondary.yellowMedium}
            content={'Please, confirm transaction in your wallet.'}
          />
        )}
        {txStatus === 'pending' && isConfirmingTx && (
          <Spinner variant={'secondary'} text={'Waiting for transaction'} />
        )}
        {error && (
          <div className="max-w-435 flex content-center items-center">
            <ErrorMessage content={error.message.split('\n')[0]} />
          </div>
        )}
        {txStatus === 'success' && (
          <>
            <SuccessMessage content={'Transaction executed successfully'} />
            <Button
              outlined
              borderColor={colors.secondary.greenMedium}
              textColor={colors.secondary.greenMedium}
              label={
                activeTransaction === transactions.length - 1
                  ? 'Finish'
                  : 'Next Transaction'
              }
              onClick={() => {
                setActiveTransaction((prev) => prev + 1);
                if (activeTransaction === transactions.length - 1) {
                  return;
                }

                onSendTxClicked();
              }}
            />
          </>
        )}
        {hash && (
          <div className="w-full flex gap-10 items-center content-center">
            <Text
              variant={'littleBody'}
              content={'Transaction Hash: '}
              color={colors.background['03']}
            />
            <Tooltip content={hash}>
              <Text
                variant={'littleBody'}
                content={shortenAddress(hash)}
                color={colors.background['03']}
              />
            </Tooltip>
            <IconButton
              icon={'copy'}
              tooltip={{
                onHover: true,
                contentOnClick: 'Copied',
                contentOnHover: 'Copy',
              }}
              onClick={() => onCopyClicked(hash)}
            />
            <IconButton
              icon={'arrowUpRight'}
              tooltip={{
                onHover: true,
                contentOnHover: 'See in explorer',
              }}
              onClick={() => onSeeInExplorerClicked(hash)}
            />
          </div>
        )}
      </div>
    );
  };

  const Step3 = () => {
    return (
      <div className="w-full flex-col gap-30 items-center">
        <SuccessIcon size={'60px'} />
        <Text
          variant={'h2'}
          content={'All transactions have been executed!'}
          color={colors.secondary.greenMedium}
        />
        <Text
          color={colors.background['02']}
          content={'The entire consolidation process can take a few days.'}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      width={'900px'}
      onClose={handleClose}
      icon={'arrowsHorizontal'}
      iconColor={colors.secondary.greenMedium}
      title={'Consolidate Validators'}
      titleColor={colors.secondary.greenMedium}
    >
      {getStep() === 1 && <Step1 />}
      {getStep() === 2 && <Step2 />}
      {getStep() === 3 && <Step3 />}
    </Modal>
  );
};
