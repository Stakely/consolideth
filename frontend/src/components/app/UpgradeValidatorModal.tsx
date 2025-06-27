import { FC, useEffect, useState } from 'react';
import {
  UpgradeValidatorResponse,
  useAccountValidators,
  useNetwork,
  useSettings,
  Validator,
} from '@/providers';
import {
  Button,
  IconButton,
  Modal,
  Spinner,
  SuccessMessage,
  Text,
  Tooltip,
} from '@/components';
import { shortenAddress } from '@/providers/utils.ts';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useTheme } from '@/providers/theme-provider';

type UpgradeValidatorModalProps = {
  isOpen: boolean;
  validator: Validator;
  onClose: () => void;
};

type UmamiWindow = Window & {
  umami: {
    track: (str: string, args: Record<string, string>) => void;
  };
};

export const UpgradeValidatorModal: FC<UpgradeValidatorModalProps> = ({
  isOpen,
  validator,
  onClose,
}) => {
  const { colors } = useTheme();
  const { upgradeValidator } = useAccountValidators();
  const { selectedChain } = useNetwork();
  const { address } = useAccount();
  const { get } = useSettings();
  const [isUpgradeLoading, setUpgradeLoading] = useState<boolean>(false);
  const [upgradePayload, setUpgradePayload] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    status: txStatus,
    sendTransaction,
    data: hash,
  } = useSendTransaction();
  const { isLoading: isConfirmingTx } = useWaitForTransactionReceipt();

  useEffect(() => {
    if (txStatus !== 'success') {
      return;
    }

    const eventName = `${selectedChain}_validator_upgraded`;
    (window as unknown as UmamiWindow).umami.track(eventName, {
      tx: JSON.stringify(upgradePayload),
      wallet: address ?? '',
      hash,
    });
  }, [txStatus]);

  const onUpgradeValidator = () => {
    setUpgradeLoading(true);
    upgradeValidator(
      validator.pubkey,
      onUpgradeValidatorSuccess,
      onUpgradeValidatorError
    );
  };

  const onUpgradeValidatorSuccess = (data: UpgradeValidatorResponse) => {
    setUpgradeLoading(false);
    setUpgradePayload(data.payloads[0].payload);
  };

  const onUpgradeValidatorError = () => {
    setUpgradeLoading(false);
  };

  const getStep = () => {
    if (upgradePayload === null) {
      return 1;
    }

    return 2;
  };

  const getBodyText = () => {
    const step = getStep();
    if (step === 1) {
      return "You are about to update your validator's credential type from 0x1 to 0x2 to prepare it for consolidations. <b>Are you sure?</b>";
    }

    return 'Please, click on the button to send upgrade transaction';
  };

  const getAcceptButton = () => {
    const step = getStep();
    if (step === 1) {
      return 'Upgrade';
    }

    return undefined;
  };

  const getCancelButton = () => {
    const step = getStep();
    if (step === 1) {
      return 'Cancel';
    }

    return undefined;
  };

  const onSendTxClicked = () => {
    if (!upgradePayload) {
      return;
    }

    sendTransaction(upgradePayload);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={'reload'}
      iconColor={colors.secondary.greenMedium}
      title={'Upgrade validator'}
      titleColor={colors.secondary.greenMedium}
      acceptButtonText={getAcceptButton()}
      closeButtonText={getCancelButton()}
      onCancel={onClose}
      isButtonLoading={isUpgradeLoading}
      onAccept={onUpgradeValidator}
    >
      <div className="flex-col w-full items-center gap-15">
        <Text align={'center'} content={`Validator ${validator.index}`} />
        <div className="flex content-center items-center gap-15">
          <Tooltip
            content={
              <Text
                variant={'littleBody'}
                content={validator.pubkey}
                align={'center'}
                color={colors.background['02']}
              />
            }
          >
            <Text
              align={'center'}
              content={`${shortenAddress(validator.pubkey)}`}
            />
          </Tooltip>
          <IconButton
            icon={'copy'}
            tooltip={{
              onHover: true,
              contentOnClick: 'Copied',
              contentOnHover: 'Copy',
            }}
            onClick={() => onCopyClicked(validator.pubkey)}
          />
        </div>
        <Text align={'center'} content={getBodyText()} />
        {getStep() === 2 && (
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
        )}
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
        {txStatus === 'success' && (
          <SuccessMessage content={'Transaction executed successfully'} />
        )}
        {hash && (
          <div className="w-full flex gap-10 items-center content-center">
            <Text
              variant={'littleBody'}
              content={'Transaction Hash: '}
              color={colors.background['03']}
            />
            <Text
              variant={'littleBody'}
              content={shortenAddress(hash)}
              color={colors.background['03']}
            />
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
              onClick={() => onSeeInExplorerClicked(hash)}
              tooltip={{
                onHover: true,
                contentOnHover: 'See in explorer',
              }}
            />
          </div>
        )}
        {txStatus === 'success' && (
          <Text
            color={colors.background['03']}
            align={'center'}
            content={
              'Once the transaction is confirmed on-chain, the upgrade to 0x02 withdrawal credentials does not take effect immediately.\n' +
              'It becomes active at the beginning of the next epoch, which may take up to ~10 minutes'
            }
          />
        )}
      </div>
    </Modal>
  );
};
