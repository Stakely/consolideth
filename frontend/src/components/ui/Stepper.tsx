import { FC } from 'react';
import { Step, StepLabel, Stepper as MUIStepper } from '@mui/material';
import { useTheme } from '@/providers/theme-provider';

type StepperProps = {
  steps: string[];
  activeStepIndex: number;
};

export const Stepper: FC<StepperProps> = ({ steps, activeStepIndex }) => {
  const { colors } = useTheme();

  return (
    <MUIStepper
      activeStep={activeStepIndex}
      alternativeLabel
      variant={'outlined'}
    >
      {steps.map((step, i) => (
        <Step key={step + '__' + i}>
          <StepLabel
            sx={{
              '.MuiStepLabel-label': {
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '12px',
                color: colors.background['00'],

                '&.Mui-active': {
                  color: colors.secondary.greenMedium,
                },
                '&.Mui-completed': {
                  color: colors.secondary.greenMedium,
                },
              },
              '.MuiStepIcon-root': {
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '25px',
                color: colors.background['03'],

                '&.Mui-active': {
                  color: colors.secondary.greenMedium,
                  fontSize: '25px',
                },
                '&.Mui-completed': {
                  color: colors.secondary.greenMedium,
                },
              },
            }}
          >
            {step}
          </StepLabel>
        </Step>
      ))}
    </MUIStepper>
  );
};
