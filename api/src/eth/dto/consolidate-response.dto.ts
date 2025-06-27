import { ApiProperty } from '@nestjs/swagger';

export class ConsolidateResponseDto {
  @ApiProperty({
    description: 'Ethereum transaction hash',

    example:
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    type: String,
  })
  transactionHash: string;

  @ApiProperty({
    description: 'Gas used by the transaction',
    example: '121000',
    type: String,
  })
  gasUsed: string;
}
