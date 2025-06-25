import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { BeaconChainService } from '../services/beacon-chain.service';
import { Web3Service } from '../services/web3.service';
import { NetworkConfigService } from '../services/network-config.service';
import { ValidatorDto } from '../dto/validator.dto';
import { ConsolidateRequestDto } from '../dto/consolidate-request.dto';
import { ConsolidationResponseDto } from '../dto/consolidation-response.dto';
import { ApiOkResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { ValidatorStatusEnum } from '../validator-status.enum';

@ApiTags('eth')
@Controller({
  path: 'eth',
  version: '1',
})
export class EthController {
  private readonly logger = new Logger(EthController.name);

  constructor(
    private readonly beaconChainService: BeaconChainService,
    private readonly web3Service: Web3Service,
    private readonly networkConfigService: NetworkConfigService,
  ) {}

  private validateAndGetNetwork(headers: any): string {
    const network = headers['x-network'] || headers['X-Network'];

    if (!network) {
      throw new BadRequestException('Network header is required');
    }

    // Validate network
    if (!['mainnet', 'hoodi'].includes(network)) {
      throw new BadRequestException(
        `Invalid network: ${network}. Supported networks: mainnet, hoodi`,
      );
    }

    return network.toLowerCase();
  }

  @Get('validators')
  @ApiOkResponse({
    description: 'Get validators by withdrawal credentials',
    type: [ValidatorDto],
  })
  @ApiHeader({
    name: 'x-network',
    description: 'Ethereum network (mainnet, hoodi)',
    required: true,
  })
  async getValidators(
    @Query('withdrawalCredentials') withdrawalCredentials: string,
    @Headers() headers: any,
  ): Promise<ValidatorDto[]> {
    try {
      const network = this.validateAndGetNetwork(headers);

      if (!withdrawalCredentials) {
        throw new Error('Withdrawal credentials must be provided');
      }

      this.logger.log(
        `Fetching validators for withdrawal credentials: ${withdrawalCredentials} on network: ${network}`,
      );

      // Get the SHARD_COMMITTEE_PERIOD
      const shardCommitteePeriod =
        await this.beaconChainService.getShardCommitteePeriod(network);
      this.logger.log(`Using SHARD_COMMITTEE_PERIOD: ${shardCommitteePeriod}`);

      // Fetch current epoch
      this.logger.log('Fetching current epoch...');
      const currentEpoch =
        await this.beaconChainService.fetchCurrentEpoch(network);
      this.logger.log(`Current epoch: ${currentEpoch}`);

      const validators =
        await this.beaconChainService.fetchValidatorsByWithdrawalCredentials(
          withdrawalCredentials,
          network,
        );
      this.logger.log(`Found ${validators.length} validators`);

      // Extract validator indices
      const validatorIndices = validators.map((validator) =>
        validator.validatorindex.toString(),
      );
      this.logger.log(`Extracted ${validatorIndices.length} validator indices`);

      // Fetch detailed validator data using indices
      this.logger.log('Fetching detailed validator data...');
      const detailedValidatorData =
        await this.beaconChainService.fetchValidatorsBeaconChainData(
          validatorIndices,
          network,
        );
      this.logger.log(
        `Retrieved detailed data for ${detailedValidatorData.length} validators`,
      );

      // Create a map of detailed data for faster lookup
      const detailedDataMap = new Map();
      detailedValidatorData.forEach((detail) => {
        if (detail.validatorindex) {
          detailedDataMap.set(detail.validatorindex.toString(), detail);
        }
      });

      // Process and format validator data
      const formattedResults: ValidatorDto[] = validators.map((validator) => {
        const validatorIndex = validator.validatorindex.toString();
        const detailedData = detailedDataMap.get(validatorIndex);

        // Extract credential type (first 4 chars, then last 2 chars of that)
        let credtype = '';
        if (detailedData?.withdrawalcredentials) {
          credtype = detailedData.withdrawalcredentials
            .substring(0, 4)
            .substring(2);
        }

        // Get activation epoch
        const activationEpoch =
          detailedData?.activationepoch !== undefined
            ? parseInt(detailedData.activationepoch, 10)
            : Infinity;

        // Determine if consolidable based on:
        // 1. Credential type ('01' or '02')
        // 2. Activation epoch + shardCommitteePeriod < current epoch
        const isconsolidable =
          ['01', '02'].includes(credtype) &&
          activationEpoch + shardCommitteePeriod < currentEpoch &&
          [
            ValidatorStatusEnum.active_online,
            ValidatorStatusEnum.active_offline,
            ValidatorStatusEnum.deposited,
          ].includes(detailedData.status);

        // Get balance from detailed data
        const balance = detailedData?.balance || 0;

        // Determine status
        let status = 'unknown';
        if (detailedData?.status) {
          status = detailedData.status;
        }

        return {
          index: validator.validatorindex,
          pubkey: validator.publickey,
          balance: balance,
          credtype: credtype,
          status: status,
          isconsolidable: isconsolidable,
        };
      });

      this.logger.log(`Processed ${formattedResults.length} validators`);

      return formattedResults;
    } catch (error) {
      this.logger.error('Error in getValidators:', error);
      throw error;
    }
  }

  @Post('consolidate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Craft N consolidation transactions',
    type: ConsolidationResponseDto,
  })
  @ApiHeader({
    name: 'x-network',
    description: 'Ethereum network (mainnet, hoodi)',
    required: true,
  })
  async consolidate(
    @Body() consolidateRequestDto: ConsolidateRequestDto,
    @Headers() headers: any,
  ): Promise<ConsolidationResponseDto> {
    try {
      const network = this.validateAndGetNetwork(headers);
      const { targetPubkey, sourcePubkeys, sender } = consolidateRequestDto;

      if (!sender) {
        throw new Error('Sender address must be provided');
      }

      this.logger.log(
        `Validating consolidation requirements for target: ${targetPubkey}, sources: ${sourcePubkeys.length}, sender: ${sender}, network: ${network}`,
      );

      // Validate consolidation requirements before proceeding
      const validationResult =
        await this.beaconChainService.validateConsolidationRequirements(
          targetPubkey,
          sourcePubkeys,
          sender,
          network,
        );

      // If validation fails, return error with details
      if (!validationResult.valid) {
        this.logger.warn(
          `Consolidation validation failed: ${validationResult.error}`,
        );
        return {
          success: false,
          error: validationResult.error,
          details: validationResult.validators || [],
        };
      }

      this.logger.log(
        `Generating consolidation payloads for target: ${targetPubkey}, sources: ${sourcePubkeys.length}, sender: ${sender}, network: ${network}`,
      );

      // Generate transaction payloads without sending
      const payloads = await this.web3Service.generateConsolidationPayloads(
        targetPubkey,
        sourcePubkeys,
        sender,
        network,
      );

      return {
        success: true,
        targetPubkey,
        sourcePubkeysCount: sourcePubkeys.length,
        sender,
        payloads,
      };
    } catch (error) {
      this.logger.error('Error in consolidate endpoint:', error);
      throw error;
    }
  }

  /**
   * This endpoint has been commented out since it requires signing transactions
   * which should now be handled by the external client
   */
  // @Post('execute-consolidation')
  // async executeConsolidation(
  //   @Body() consolidateRequestDto: ConsolidateRequestDto,
  // ): Promise<ConsolidateResponseDto> {
  //   try {
  //     const { targetPubkey, sourcePubkeys } = consolidateRequestDto;

  //     this.logger.log(
  //       `Executing consolidation for target: ${targetPubkey}, sources: ${sourcePubkeys.length}`,
  //     );

  //     // Actually execute the consolidation
  //     const txResult = await this.web3Service.consolidate(
  //       targetPubkey,
  //       sourcePubkeys,
  //     );

  //     return {
  //       transactionHash: txResult.transactionHash,
  //       gasUsed: txResult.gasUsed,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error in execute-consolidation endpoint:', error);
  //     throw error;
  //   }
  // }
}
