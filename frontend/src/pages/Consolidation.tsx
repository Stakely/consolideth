import { FC, useEffect, useState } from 'react';
import {
  Button,
  ConsolidationModal,
  Divider,
  GithubButton,
  Input,
  Logo,
  SelectNetwork,
  Spinner,
  Surface,
  Text,
  UpgradeValidatorModal,
  ValidatorTable,
} from '@/components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccountValidators, Validator } from '@/providers';
import { useTheme } from '@/providers/theme-provider';

export const Consolidation: FC = () => {
  const { validators, isLoading } = useAccountValidators();
  const { colors } = useTheme();

  const [filteredValidators, setFilteredValidators] = useState<
    Array<Validator>
  >([]);
  const [filter, setFilter] = useState<string>('');

  const [selectedValidator, setSelectedValidator] =
    useState<Validator | null>();
  const [isUpgradeValidatorModalOpen, setUpgradeValidatorModalOpen] =
    useState<boolean>(false);

  const [isConsolidationModalOpen, setConsolidationModalOpen] =
    useState<boolean>(false);

  const onUpgradeValidatorModalClose = () => {
    setSelectedValidator(null);
    setUpgradeValidatorModalOpen(false);
  };

  const onUpgradeValidator = (validator: Validator) => {
    setSelectedValidator(validator);
    setUpgradeValidatorModalOpen(true);
  };

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

  const activeValidatorsCount = validators.filter((v) =>
    v.status.startsWith('active')
  ).length;
  const consolidableValidatorsCount = validators.filter(
    (v) => v.isconsolidable
  ).length;
  const validatorsCount = validators.length;

  const isConsolidateButtonEnabled = () => {
    return validators.length > 1;
  };

  return (
    <div
      className={
        'flex w-full h-100vh gap-30 bg-gradient-consolidation content-center'
      }
    >
      <div
        className="flex-col w-full w-full gap-30 p-y-65 p-x-50 max-h-100vh"
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="w-full flex space-between items-center">
          <div className={'flex gap-15 items-end'}>
            <Logo />
            <Text
              variant={'h3'}
              content={'Consolidate your Ethereum validators'}
            />
          </div>
          <div className="flex gap-15 items-center">
            <ConnectButton
              showBalance={false}
              accountStatus={'address'}
              chainStatus="none"
            />
            <div>
              <SelectNetwork />
            </div>
            <GithubButton />
          </div>
        </div>
        <div className={'w-full flex-col gap-15'}>
          <Text
            variant={'h2'}
            color={colors.primary['02']}
            content={'Your overview'}
          />
          <Text
            variant={'body2'}
            color={colors.background['01']}
            content={
              "Here's a breakdown of all validators associated with your wallet. You can review their current withdrawal credentials, check eligibility for consolidation, and proceed to consolidate as many validators as you can."
            }
          />
        </div>
        <Divider color={colors.background['03']} opacity={0.5} />
        <div className={'w-full flex gap-50'}>
          <div className={'w-50 flex-col gap-15'}>
            <Text
              variant={'h3'}
              color={colors.primary['02']}
              content={'All validators'}
            />
            <Text
              variant={'body2'}
              color={colors.background['01']}
              content={
                'This is the list of validators detected in your connected wallet, regardless of their credential type.'
              }
            />
          </div>
          <div className={'w-50 flex gap-15'}>
            <Surface
              padding={'15px'}
              opacity={0.5}
              background={colors.background['06']}
            >
              <div className="flex-col gap-15 w-full">
                <Text
                  variant={'body2'}
                  color={colors.background['02']}
                  content={'Validators'}
                />
                <div className="w-full flex space-between items-center">
                  <Text variant={'body1'} content={'Active'} />
                  <Text
                    variant={'body1'}
                    content={activeValidatorsCount.toString()}
                  />
                </div>
              </div>
            </Surface>
            <Surface
              padding={'15px'}
              opacity={0.5}
              background={colors.background['06']}
            >
              <div className="flex-col gap-15 w-full">
                <Text
                  variant={'body2'}
                  color={colors.background['02']}
                  content={'Validators'}
                />
                <div className="w-full flex space-between items-center">
                  <Text variant={'body1'} content={'Consolidable'} />
                  <Text
                    variant={'body1'}
                    content={consolidableValidatorsCount.toString()}
                  />
                </div>
              </div>
            </Surface>
            <Surface
              padding={'15px'}
              opacity={0.5}
              background={colors.background['06']}
            >
              <div className="flex-col gap-15 w-full">
                <Text
                  variant={'body2'}
                  color={colors.background['02']}
                  content={'Validators'}
                />
                <div className="w-full flex space-between items-center">
                  <Text variant={'body1'} content={'Total'} />
                  <Text
                    variant={'body1'}
                    content={validatorsCount.toString()}
                  />
                </div>
              </div>
            </Surface>
          </div>
        </div>
        <div className="w-full flex gap-30 items-center">
          <div className="flex gap-15 items-center w-75">
            <Button
              icon={'fire'}
              disabled={!isConsolidateButtonEnabled()}
              label={'Consolidate'}
              background={
                isConsolidateButtonEnabled()
                  ? colors.secondary.greenMedium
                  : colors.background['03']
              }
              onClick={() => setConsolidationModalOpen(true)}
            />
            <div className="flex-col gap-15 w-full">
              <Text
                variant={'h3'}
                color={colors.secondary.greenMedium}
                content={'Why consolidate?'}
              />
              <Text
                variant={'body2'}
                color={colors.background['01']}
                content={
                  'Reduce operational overhead, simplify validator tracking, and auto-compounding.'
                }
              />
            </div>
          </div>
          <div className="flex w-25">
            <div className="flex w-full">
              <Input
                variant={'secondary'}
                icon={'research'}
                placeholder={'Search...'}
                bgColor={'rgba(255, 255, 255, 0.15)'}
                size={'sm'}
                updateModel={(val) => setFilter(val)}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex gap-30 items-start">
          <div className="w-75 flex items-start">
            {validators.length > 0 && (
              <ValidatorTable
                validators={filteredValidators}
                onUpgradeValidator={onUpgradeValidator}
              />
            )}
            {validators.length === 0 && !isLoading && (
              <div className="w-full flex content-center">
                <Text
                  color={colors.background['01']}
                  content={
                    "We couldn't find any validators associated with the connected wallet."
                  }
                />
              </div>
            )}
            {isLoading && (
              <div className="w-full flex content-center">
                <Spinner variant={'secondary'} text={'Loading validators'} />
              </div>
            )}
          </div>
          <div className="w-25">
            <Surface
              padding={'30px 15px'}
              opacity={0.5}
              background={colors.background['06']}
            >
              <div className="flex-col w-full gap-30 items-center content-center">
                <Text
                  align={'center'}
                  variant={'h3'}
                  content={'Consolidate your validators\n in 3 simple steps'}
                />
                <div className="flex-col gap-15 w-full items-center">
                  <div className="flex-col gap-10 w-full items-center">
                    <img src={'/img/step_1.png'} />
                    <Text
                      align={'center'}
                      weight={700}
                      content={'Review your validators'}
                    />
                    <Text
                      align={'center'}
                      variant={'littleBody'}
                      color={colors.background['02']}
                      content={
                        'See all validators linked to your wallet. Upgrade those with 0x01 credentials to proceed.'
                      }
                    />
                  </div>
                  <div className="flex-col gap-10 w-full items-center">
                    <img src={'/img/step_2.png'} />
                    <Text
                      align={'center'}
                      weight={700}
                      content={'Select source and target validators'}
                    />
                    <Text
                      align={'center'}
                      variant={'littleBody'}
                      color={colors.background['02']}
                      content={
                        'Choose one or more source validators and a single target validator with 0x02 credentials.'
                      }
                    />
                  </div>
                  <div className="flex-col gap-10 w-full items-center">
                    <img src={'/img/step_3.png'} />
                    <Text
                      align={'center'}
                      weight={700}
                      content={'Confirm and consolidate'}
                    />
                    <Text
                      align={'center'}
                      variant={'littleBody'}
                      color={colors.background['02']}
                      content={
                        'Review the details, sign the transaction, and submit it to the network to consolidate your validators.'
                      }
                    />
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </div>
      {selectedValidator && (
        <UpgradeValidatorModal
          isOpen={isUpgradeValidatorModalOpen}
          validator={selectedValidator}
          onClose={onUpgradeValidatorModalClose}
        />
      )}
      <ConsolidationModal
        isOpen={isConsolidationModalOpen}
        validators={validators}
        onClose={() => setConsolidationModalOpen(false)}
      />
    </div>
  );
};
