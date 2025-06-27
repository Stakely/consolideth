import { FC } from 'react';
import {
  Accordion,
  Footer,
  Logo,
  SelectNetwork,
  useIsMobile,
  Text,
} from '@/components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTheme } from '@/providers/theme-provider';

export const ConnectWallet: FC = () => {
  const { colors } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="flex-col w-full h-100vh bg-gradient-connect o-hidden items-center content-center relative border-box">
      <div
        className="flex-col items-center w-full max-h-100vh gap-50 p-x-15 p-y-15"
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
          paddingBottom: '50px',
        }}
      >
        <div className="flex-col items-center w-full gap-50 max-w-950 p-x-15 p-y-15">
          <Logo />
          <Text
            align={'center'}
            variant={'h1'}
            content={'Consolidate your Ethereum validators'}
          />
          <Text
            align={'center'}
            variant={'h2'}
            content={
              'A tool to merge your Ethereum validators into larger ones, powered by Stakely. Clean up your staking infrastructure with a few simple steps.'
            }
          />
          <Text
            align={'center'}
            variant={'body2'}
            color={colors.background['02']}
            content={
              'You can switch between Mainnet and Hoodi for testing purposes'
            }
          />
          <div className="flex-col gap-2r items-center">
            <SelectNetwork />
            <ConnectButton
              label={'Connect Wallet'}
              chainStatus={'none'}
              accountStatus={'address'}
              showBalance={false}
            />
          </div>
          <div className={'flex-col gap-10'}>
            <div className={`${isMobile ? 'flex-col gap-10' : 'flex gap-30'}`}>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={'How it works?'}
                  content={
                    '' +
                    '<b>1. Connect your wallet</b>\n' +
                    'Connect your wallet to load your validator data. Compatible with MetaMask, Rabby, WalletConnect and more.\n\n' +
                    '<b>2. Review your validators</b>\n' +
                    'See all validators linked to your wallet. Upgrade those with 0x01 credentials to proceed.\n\n' +
                    '<b>3. Select source and target validators</b>\n' +
                    'Choose one or more source validators and a single target validator with 0x02 credentials.\n\n' +
                    '<b>4. Confirm and consolidate</b>\n' +
                    'Review the details, sign the transactions, and submit them to the network to consolidate your validators.'
                  }
                />
              </div>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={'Why consolidate Ethereum validators?'}
                  content={
                    'Consolidating Ethereum validators can result in reduced operational complexity, lower infrastructure resource usage, improved traceability and control over your funds and operational flows,and auto-compounding for extra rewards'
                  }
                />
              </div>
            </div>
            <div className={`${isMobile ? 'flex-col gap-10' : 'flex gap-30'}`}>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={'What does Ethereum validator consolidation mean?'}
                  content={
                    'Consolidation is the process by which you can merge multiple active validators (each with 32+ ETH) into a single target validator by transferring their balances, effectively reducing the total number of validators you operate. This is only possible with validators that already use 0x02 withdrawal credentials.'
                  }
                />
              </div>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={'How do I consolidate Ethereum validators?'}
                  content={
                    'Connect your wallet to the tool and ensure the validators you want to consolidate have 0x02 withdrawal credentials. Then, select one or more validators as the source, and choose a 0x02 validator as the target. Finally, sign the transaction and wait for confirmation.'
                  }
                />
              </div>
            </div>
            <div className={`${isMobile ? 'flex-col gap-10' : 'flex gap-30'}`}>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={
                    "Why can't I consolidate a validator with 0x01 withdrawal credentials?"
                  }
                  content={
                    'Only validators with 0x02 withdrawal credentials are eligible for consolidation.\n\n' +
                    'Validators using 0x00 or 0x01 credentials cannot transfer their balance to another validator, as they are not capable of issuing partial or full withdrawals to an execution address.\n\n' +
                    'To make a validator eligible for consolidation, you can upgrade its 0x01 credentials to 0x02 by clicking the "Upgrade" button.'
                  }
                />
              </div>
              <div className={'w-50'}>
                <Accordion
                  title={
                    'How long does it take to upgrade withdrawal credentials to 0x02?'
                  }
                  content={
                    'Once the transaction is confirmed on-chain, the upgrade to 0x02 withdrawal credentials does not take effect immediately.\n\n' +
                    'It becomes active at the beginning of the next epoch, which may take up to ~10 minutes. This delay is due to the structure of the Ethereum consensus protocol, where validator credential updates are processed at epoch boundaries.\n\n' +
                    'In summary, the upgrade typically takes effect within 1 epoch — approximately 10 minutes at most.'
                  }
                />
              </div>
            </div>
            <div className={`${isMobile ? 'flex-col gap-10' : 'flex gap-30'}`}>
              <div className={isMobile ? 'w-full' : 'w-50'}>
                <Accordion
                  title={'How long does validator consolidation take?'}
                  content={
                    'Validator consolidation is a process introduced with the Ethereum Pectra upgrade that allows eligible validators to merge their balances.\n\n' +
                    'It requires a voluntary exit followed by a withdrawal and re-deposit, all of which are subject to network limits and queuing mechanisms.\n\n' +
                    'As a result, consolidation can take several days to complete, depending on overall network activity and the number of validators exiting or entering at the same time.'
                  }
                />
              </div>
              <div className={'w-50'}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full fixed b-0">
        <div className="flex content-center items-center w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};
