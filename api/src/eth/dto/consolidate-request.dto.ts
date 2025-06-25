import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsEthereumAddress,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ConsolidateRequestDto {
  @ApiProperty({
    description: 'Target validator public key (48 bytes in hex format)',
    example:
      '0x8a9c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353c',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  targetPubkey: string;

  @ApiProperty({
    description: 'Array of source validator public keys to consolidate from',
    example: [
      '0xa89c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353d',
      '0xb89c4d949077fd89190a508a4506f6bc916c6a255abe8eb302e8effc4b72f22a3b34672681f5cba15d4bc3e2b611353e',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sourcePubkeys: string[];

  @ApiProperty({
    description: 'Ethereum address of the transaction sender',
    example: '0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f',
    type: String,
  })
  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value?.toString())
  sender: string;
}
