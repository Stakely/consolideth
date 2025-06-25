import { ApiProperty } from '@nestjs/swagger';
import { TransactionPayloadDto } from './transaction-payload.dto';
import { ValidationErrorDetailDto } from './validation-error-detail.dto';

export class ConsolidationResponseDto {
  @ApiProperty({
    description: 'Whether the consolidation request was successful',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Target validator public key',
    example:
      '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
    type: String,
    required: false,
  })
  targetPubkey?: string;

  @ApiProperty({
    description: 'Number of source validators being consolidated',
    example: 3,
    type: Number,
    required: false,
  })
  sourcePubkeysCount?: number;

  @ApiProperty({
    description: 'Ethereum address of the transaction sender',
    example: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
    type: String,
    required: false,
  })
  sender?: string;

  @ApiProperty({
    description: 'Array of transaction payloads to be signed and submitted',
    type: [TransactionPayloadDto],
    required: false,
    example: [
      {
        payload: {
          sender: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
          from: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
          to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
          value: '0xde0b6b3a7640000',
          gas: '0x16356',
          gasPrice: '0x1bf08eb000',
          data: '0x6080604052600080fd00',
          chainId: '0x1',
        },
        isConversionTx: true,
        description:
          'Conversion transaction to change target validator credential type to 02',
        sourcePubkey:
          '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
        targetPubkey:
          '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
      },
      {
        payload: {
          sender: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
          from: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
          to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
          value: '0xde0b6b3a7640000',
          gas: '0x2c47c',
          gasPrice: '0x1bf08eb000',
          data: '0x095ea7b30000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0000000000000000000000000000000000000000000000008ac7230489e80000',
          chainId: '0x1',
        },
        isConversionTx: false,
        description: 'Consolidation transaction for multiple validators',
      },
    ],
  })
  payloads?: TransactionPayloadDto[];

  @ApiProperty({
    description: 'Error message if validation failed',
    example: 'Some validators failed validation',
    type: String,
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Details of validation errors for specific validators',
    type: [ValidationErrorDetailDto],
    required: false,
    example: [
      {
        pubkey:
          '0xa89c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353d',
        reason: 'Withdrawal address does not match sender address',
        details: {
          withdrawalAddress: '0x1234567890abcdef1234567890abcdef12345678',
          senderAddress: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
        },
      },
      {
        pubkey:
          '0xb89c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353e',
        reason: 'Validator is not consolidable',
        details: {
          credtype: '01',
          activationEpoch: 12345,
          currentEpoch: 12500,
          shardCommitteePeriod: 256,
        },
      },
    ],
  })
  details?: ValidationErrorDetailDto[];
}
