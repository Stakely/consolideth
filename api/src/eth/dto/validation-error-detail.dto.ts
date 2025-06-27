import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDetailDto {
  @ApiProperty({
    description: 'Public key of the validator that failed validation',
    example:
      '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
    type: String,
  })
  pubkey: string;

  @ApiProperty({
    description: 'Reason for validation failure',
    example: 'Withdrawal address does not match sender address',
    type: String,
  })
  reason: string;

  @ApiProperty({
    description: 'Additional details about the validation failure',
    example: {
      withdrawalAddress: '0x1234567890abcdef1234567890abcdef12345678',
      senderAddress: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
    },
    required: false,
  })
  details?: Record<string, any>;
}
