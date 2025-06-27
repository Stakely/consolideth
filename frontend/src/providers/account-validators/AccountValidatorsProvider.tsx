import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNetwork, useSettings } from '@/providers';
import { useAccount } from 'wagmi';
import { get, post } from '@/providers/account-validators/http.ts';

export type ValidatorNodeStatus =
  | 'deposit_required'
  | 'activating'
  | 'pending'
  | 'deposited'
  | 'exiting_online'
  | 'exiting_offline'
  | 'active_online'
  | 'active_offline'
  | 'exited'
  | 'slashed'
  | 'slashing_online'
  | 'slashing_offline'
  | 'slashed_online'
  | 'slashed_offline';

export type UpgradeValidatorResponse = {
  success: boolean;
  sender: string;
  sourcePubkeysCount: number;
  targetPubkey: string;
  payloads: Array<Payload>;
};

export type Payload = {
  description: string;
  isConversionTx: boolean;
  isSelfConsolidation: boolean;
  payload: Record<string, string>;
  sourcePubkey: string;
  targetPubkey: string;
};

export type Validator = {
  index: number;
  pubkey: string;
  balance: number;
  credtype: string;
  status: ValidatorNodeStatus;
  isconsolidable: boolean;
};

type AccountValidatorsContextType = {
  validators: Array<Validator>;
  isLoading: boolean;
  upgradeValidator: (
    validatorAddress: string,
    onSuccess: (data: UpgradeValidatorResponse) => void,
    onError: (error: string) => void
  ) => Promise<void>;
  consolidateValidators: (
    targetValidator: string,
    sourceValidators: Array<string>,
    onSuccess: (data: UpgradeValidatorResponse) => void,
    onError: (error: string) => void
  ) => Promise<void>;
};

const AccountValidatorsContext =
  createContext<AccountValidatorsContextType | null>(null);

export const AccountValidatorsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [validators, setValidators] = useState<Array<Validator>>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { selectedChain } = useNetwork();
  const { address } = useAccount();

  const { get: getSetting } = useSettings();

  const fetchValidators = async () => {
    setLoading(true);
    const apiUrl = getSetting<string>('API_URL');
    const response = await get<Array<Validator>>({
      network: selectedChain,
      endpoint: `${apiUrl}/v1/eth/validators?withdrawalCredentials=${address}`,
    });

    if (response.error) {
      setLoading(false);
      return;
    }

    setLoading(false);
    setValidators(response.result);
  };

  const upgradeValidator = async (
    validatorAddress: string,
    onSuccess: (data: UpgradeValidatorResponse) => void,
    onError: (error: string) => void
  ) => {
    const apiUrl = getSetting<string>('API_URL');
    const response = await post<
      {
        targetPubkey: string;
        sourcePubkeys: string[];
        sender: string;
      },
      UpgradeValidatorResponse
    >({
      network: selectedChain,
      endpoint: `${apiUrl}/v1/eth/consolidate`,
      body: {
        targetPubkey: validatorAddress,
        sourcePubkeys: [validatorAddress],
        sender: address as string,
      },
    });

    if (response.error) {
      return onError(response.error);
    }

    if (!response.result.success) {
      return onError('Oooops! Something went wrong');
    }

    const payloadsWithoutGas = response.result.payloads.map((p) => {
      delete p.payload.gasPrice;
      delete p.payload.gasLimit;
      delete p.payload.nonce;
      delete p.payload.gas;
      delete p.payload.chainId;

      return { ...p };
    });

    return onSuccess({ ...response.result, payloads: payloadsWithoutGas });
  };

  const consolidateValidators = async (
    targetValidator: string,
    sourceValidators: Array<string>,
    onSuccess: (data: UpgradeValidatorResponse) => void,
    onError: (error: string) => void
  ) => {
    const apiUrl = getSetting<string>('API_URL');
    const response = await post<
      {
        targetPubkey: string;
        sourcePubkeys: string[];
        sender: string;
      },
      UpgradeValidatorResponse
    >({
      network: selectedChain,
      endpoint: `${apiUrl}/v1/eth/consolidate`,
      body: {
        targetPubkey: targetValidator,
        sourcePubkeys: sourceValidators,
        sender: address as string,
      },
    });

    if (response.error) {
      return onError(response.error);
    }

    if (!response.result.success) {
      return onError('Oooops! Something went wrong');
    }

    const payloadsWithoutGas = response.result.payloads.map((p) => {
      delete p.payload.gasPrice;
      delete p.payload.gasLimit;
      delete p.payload.nonce;
      delete p.payload.gas;
      delete p.payload.chainId;

      return { ...p };
    });

    return onSuccess({ ...response.result, payloads: payloadsWithoutGas });
  };

  useEffect(() => {
    if (!address) {
      return;
    }

    fetchValidators();
  }, [address, selectedChain]);

  return (
    <AccountValidatorsContext.Provider
      value={{
        validators,
        isLoading,
        upgradeValidator,
        consolidateValidators,
      }}
    >
      {children}
    </AccountValidatorsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccountValidators = () => {
  const context = useContext(AccountValidatorsContext);
  if (!context) {
    throw new Error(
      'useAccountValidators() must be used within AccountValidatorsProvider'
    );
  }

  return context;
};
