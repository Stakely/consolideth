import { ApiProperty } from '@nestjs/swagger';

export class TransactionPayloadDto {
  @ApiProperty({
    description: 'Transaction payload data for signing',
    example: {
      sender: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
      from: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
      to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      value: '0xde0b6b3a7640000', // 1 ETH in hex
      gas: '0x16356',
      gasPrice: '0x1bf08eb000',
      data: '0x6080604052600080fd00',
      chainId: '0x1',
    },
  })
  payload: Record<string, any>;

  @ApiProperty({
    description:
      'Whether this is a conversion transaction to change credential type',
    example: false,
    type: Boolean,
  })
  isConversionTx: boolean;

  @ApiProperty({
    description: 'Human readable description of the transaction purpose',
    example: 'Consolidation transaction for single validator',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Source validator public key',
    example:
      '0xa89c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353d',
    type: String,
    required: false,
  })
  sourcePubkey?: string;

  @ApiProperty({
    description: 'Target validator public key',
    example:
      '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
    type: String,
    required: false,
  })
  targetPubkey?: string;
}
