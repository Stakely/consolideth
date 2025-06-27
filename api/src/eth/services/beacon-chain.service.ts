import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ValidatorStatusEnum } from '../validator-status.enum';
import { NetworkConfigService } from './network-config.service';

@Injectable()
export class BeaconChainService {
  private readonly logger = new Logger(BeaconChainService.name);
  private beaconchainApikey?: string;
  private rateLimitPerSecond: number = 2; // Default value
  private rateLimitPerMinute: number = 100; // Default value
  private requestTimestamps: number[] = [];
  private lastRequestTime: number = 0;
  private shardCommitteePeriodCache: Map<string, number> = new Map(); // Cache per network

  constructor(
    private configService: ConfigService,
    private networkConfigService: NetworkConfigService,
  ) {
    // Load beacon chain configuration
    const beaconConfig = this.networkConfigService.getBeaconChainConfig();
    this.beaconchainApikey = beaconConfig.apiKey;
    this.rateLimitPerSecond = beaconConfig.rateLimits.perSecond;
    this.rateLimitPerMinute = beaconConfig.rateLimits.perMinute;
  }

  /**
   * Create axios instance for a specific network
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      headers: {
        'Content-Type': 'application/json',
        apikey: this.beaconchainApikey ? this.beaconchainApikey : undefined,
      },
    });
  }

  private chunkArray<T>(array: T[], chunkSize: number = 100): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Sleep for a specified number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check and enforce rate limits before making a request
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();

    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < 60000,
    );

    // Check per-minute rate limit
    if (this.requestTimestamps.length >= this.rateLimitPerMinute) {
      // Calculate the oldest timestamp that should be considered
      const oldestAllowedTimestamp =
        this.requestTimestamps[
          this.requestTimestamps.length - this.rateLimitPerMinute
        ];

      // Sleep until we can make another request
      const sleepTime = 60000 - (now - oldestAllowedTimestamp);
      this.logger.log(
        `Rate limit per minute reached. Waiting ${sleepTime}ms before next request.`,
      );
      await this.sleep(sleepTime);
    }

    // Check per-second rate limit
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minTimeBetweenRequests = 1000 / this.rateLimitPerSecond;

    if (timeSinceLastRequest < minTimeBetweenRequests) {
      const sleepTime = minTimeBetweenRequests - timeSinceLastRequest;
      this.logger.log(
        `Rate limit per second enforced. Waiting ${sleepTime}ms before next request.`,
      );
      await this.sleep(sleepTime);
    }

    // Update tracking variables
    this.lastRequestTime = Date.now();
    this.requestTimestamps.push(this.lastRequestTime);
  }

  /**
   * Fetches the SHARD_COMMITTEE_PERIOD from the Ethereum Beacon API
   * Falls back to 256 if the request fails
   */
  public async fetchShardCommitteePeriod(network: string): Promise<number> {
    // Check cache first
    if (this.shardCommitteePeriodCache.has(network)) {
      return this.shardCommitteePeriodCache.get(network)!;
    }

    try {
      const networkConfig = this.networkConfigService.getNetworkConfig(network);
      const response = await axios.get(networkConfig.beaconApiUrl);
      const specData = response?.data?.data;

      if (specData && typeof specData.SHARD_COMMITTEE_PERIOD === 'string') {
        const period = parseInt(specData.SHARD_COMMITTEE_PERIOD, 10);
        if (!isNaN(period)) {
          this.shardCommitteePeriodCache.set(network, period);
          this.logger.log(
            `Fetched SHARD_COMMITTEE_PERIOD for ${network}: ${period}`,
          );
          return period;
        }
      }

      this.logger.warn(
        `Failed to parse SHARD_COMMITTEE_PERIOD from API for ${network}, using default value`,
      );
      const defaultPeriod = 256;
      this.shardCommitteePeriodCache.set(network, defaultPeriod);
      return defaultPeriod;
    } catch {
      this.logger.warn(
        `Failed to fetch SHARD_COMMITTEE_PERIOD from API for ${network}, using default value`,
      );
      const defaultPeriod = 256;
      this.shardCommitteePeriodCache.set(network, defaultPeriod);
      return defaultPeriod;
    }
  }

  /**
   * Returns the current SHARD_COMMITTEE_PERIOD value for a network
   */
  public async getShardCommitteePeriod(network: string): Promise<number> {
    if (this.shardCommitteePeriodCache.has(network)) {
      return this.shardCommitteePeriodCache.get(network)!;
    }
    // If not cached, fetch it
    return this.fetchShardCommitteePeriod(network);
  }

  /**
   * Fetch the current epoch from the Beacon Chain API
   * @param network The network to fetch from
   * @returns The current epoch number
   */
  public async fetchCurrentEpoch(network: string): Promise<number> {
    try {
      const networkConfig = this.networkConfigService.getNetworkConfig(network);
      const axiosInstance = this.createAxiosInstance();

      // Enforce rate limit before making request
      await this.enforceRateLimit();

      const response = await axiosInstance.get(
        `${networkConfig.beaconChainApiUrl}/epoch/latest`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const epochData = response?.data?.data;

      if (epochData && typeof epochData.epoch === 'number') {
        return epochData.epoch;
      } else {
        throw new Error('Failed to retrieve current epoch data');
      }
    } catch (error) {
      // Check if error is 429 (Too Many Requests)
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        this.logger.warn('Rate limit exceeded. Waiting before retrying...');
        // Wait for 5 seconds before retrying
        await this.sleep(5000);
        // Retry the request
        return this.fetchCurrentEpoch(network);
      }

      this.logger.error(
        `Failed to fetch current epoch from the Beacon chain API for ${network}`,
        error,
      );
      throw error;
    }
  }

  public async fetchValidatorsBeaconChainData(
    pubkeyArray: string[],
    network: string,
  ): Promise<Array<any>> {
    const networkConfig = this.networkConfigService.getNetworkConfig(network);
    const axiosInstance = this.createAxiosInstance();
    const allValidatorData: Array<any> = [];
    const chunkedData = this.chunkArray(pubkeyArray, 100);

    for (const validatorChunk of chunkedData) {
      const indicesOrPubkey = validatorChunk.join(',');

      try {
        // Enforce rate limit before making request
        await this.enforceRateLimit();

        const response = await axiosInstance.post(
          `${networkConfig.beaconChainApiUrl}/validator`,
          { indicesOrPubkey },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );

        const pubkeys = response?.data?.data;

        if (pubkeys) {
          if (Array.isArray(pubkeys)) {
            allValidatorData.push(...pubkeys);
          } else {
            allValidatorData.push(pubkeys);
          }
        }
      } catch (error) {
        // Check if error is 429 (Too Many Requests)
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          this.logger.warn('Rate limit exceeded. Waiting before retrying...');
          // Wait for 5 seconds before retrying
          await this.sleep(5000);
          // Retry the current chunk
          validatorChunk.unshift();
          continue;
        }

        this.logger.error(
          `Failed to fetch validators from the Beacon chain API for ${network}`,
          error,
        );
      }
    }

    return allValidatorData;
  }

  public async fetchValidatorsByWithdrawalCredentials(
    withdrawalCredentialsOrEth1address: string,
    network: string,
  ): Promise<any[]> {
    const networkConfig = this.networkConfigService.getNetworkConfig(network);
    const axiosInstance = this.createAxiosInstance();
    const MAX_LIMIT = 200;
    const allValidators: any[] = [];
    let offset = 0;
    let hasMore = true;
    let lastElementPrevious: any = null;

    while (hasMore) {
      try {
        // Enforce rate limit before making request
        await this.enforceRateLimit();

        const response = await axiosInstance.get(
          `${networkConfig.beaconChainApiUrl}/validator/withdrawalCredentials/${withdrawalCredentialsOrEth1address}`,
          {
            params: {
              limit: MAX_LIMIT,
              offset: offset,
            },
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );

        const validators = response?.data?.data;

        if (
          !validators ||
          !Array.isArray(validators) ||
          validators.length === 0
        ) {
          // No data returned or empty array
          hasMore = false;
          break;
        }

        if (validators.length < MAX_LIMIT) {
          // Less than the maximum limit, so we've reached the end
          allValidators.push(...validators);
          hasMore = false;
          break;
        }

        // If we have a full page of results (MAX_LIMIT)
        if (validators.length === MAX_LIMIT) {
          // Check if the last element is the same as the previous batch's last element
          const lastElement = validators[validators.length - 1];

          if (
            lastElementPrevious &&
            (lastElement.publickey === lastElementPrevious.publickey ||
              lastElement.validatorindex === lastElementPrevious.validatorindex)
          ) {
            // Last element is the same, we've reached the end
            hasMore = false;
            break;
          }

          // Store the last element for next comparison
          lastElementPrevious = lastElement;

          // Add results to our collection
          allValidators.push(...validators);

          // Move offset for next page
          this.logger.log(
            `Fetched ${allValidators.length} validators. In ${allValidators.length / MAX_LIMIT} Requests. Moving to offset ${offset + MAX_LIMIT}...`,
          );
          offset += MAX_LIMIT;
        }
      } catch (error) {
        // Check if error is 429 (Too Many Requests)
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          this.logger.warn(
            `Rate limit exceeded. Waiting before retrying offset ${offset}...`,
          );
          // Wait for 5 seconds before retrying
          await this.sleep(5000);
          // Don't change offset - we'll retry this batch
          continue;
        }

        this.logger.error(
          `Failed to fetch validators by withdrawal credentials from the Beacon chain API for ${network}`,
          error,
        );
        hasMore = false;
        throw error;
      }
    }

    return allValidators;
  }

  /**
   * Get a validator's credential type from its public key
   * @param pubkey The validator public key
   * @param network The network to query
   * @returns The credential type ('01' or '02' or '')
   */
  public async getValidatorCredentialType(
    pubkey: string,
    network: string,
  ): Promise<string> {
    try {
      this.logger.log(
        `Fetching credential type for validator: ${pubkey} on ${network}`,
      );

      // Remove 0x prefix if present for consistency with API
      const cleanPubkey = pubkey.startsWith('0x')
        ? pubkey.substring(2)
        : pubkey;

      const networkConfig = this.networkConfigService.getNetworkConfig(network);
      const axiosInstance = this.createAxiosInstance();

      // Enforce rate limit before making request
      await this.enforceRateLimit();

      // First get the validator index
      const response = await axiosInstance.post(
        `${networkConfig.beaconChainApiUrl}/validator`,
        { indicesOrPubkey: cleanPubkey },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const validatorData = response?.data?.data;

      if (!validatorData) {
        const errorMessage = `No validator data found for pubkey: ${pubkey} on ${network}`;
        this.logger.warn(errorMessage);
        throw new Error(errorMessage);
      }

      // Extract credential type from withdrawal credentials
      // The first byte represents the credential type (0x00, 0x01, or 0x02)
      let credType = '';
      if (validatorData?.withdrawalcredentials) {
        const withdrawalCredentials = validatorData.withdrawalcredentials;
        // Extract the first byte after 0x (positions 2 and 3)
        credType = withdrawalCredentials.substring(2, 4);
      }

      this.logger.log(
        `Validator ${pubkey} on ${network} has credential type: ${credType}`,
      );
      return credType;
    } catch (error) {
      this.logger.error(
        `Failed to get validator credential type: ${error.message}`,
      );
      return '';
    }
  }

  /**
   * Extracts Ethereum address from withdrawal credentials
   * Converts from 0x01... or 0x02... format to Ethereum address
   */
  private extractWithdrawalAddress(withdrawalCredentials: string): string {
    if (!withdrawalCredentials || withdrawalCredentials.length < 10) {
      return '';
    }

    // Check if withdrawal credentials prefix is 0x01 or 0x02
    const prefix = withdrawalCredentials.substring(0, 4);
    if (prefix !== '0x01' && prefix !== '0x02') {
      return '';
    }

    // For 0x01, it's embedded in the last 40 characters (20 bytes)
    // For 0x02, it's directly embedded in bytes 12-32
    const address = withdrawalCredentials.substring(
      withdrawalCredentials.length - 40,
    );
    return `0x${address}`.toLowerCase();
  }

  /**
   * Validate validators for consolidation requirements
   * @param targetPubkey Target validator public key
   * @param sourcePubkeys List of source validator public keys
   * @param senderAddress Address initiating the transaction
   * @param network The network to validate on
   * @returns Object with validation result and error message if any
   */
  public async validateConsolidationRequirements(
    targetPubkey: string,
    sourcePubkeys: string[],
    senderAddress: string,
    network: string,
  ): Promise<{ valid: boolean; error?: string; validators?: any[] }> {
    try {
      this.logger.log(
        `Validating consolidation requirements for ${sourcePubkeys.length} validators to target ${targetPubkey}, sender: ${senderAddress}, network: ${network}`,
      );

      // Normalize sender address for comparison
      const normalizedSenderAddress = senderAddress.toLowerCase();

      // Get all pubkeys, including target, but deduplicate them
      const allPubkeysArray = [targetPubkey, ...sourcePubkeys];
      const uniquePubkeys = Array.from(new Set(allPubkeysArray));

      this.logger.log(
        `Original pubkeys count: ${allPubkeysArray.length}, unique pubkeys count: ${uniquePubkeys.length}`,
      );

      // Fetch validators data from beacon chain using unique pubkeys
      const validatorsData = await this.fetchValidatorsBeaconChainData(
        uniquePubkeys,
        network,
      );

      // Check if all unique validators exist
      if (validatorsData.length !== uniquePubkeys.length) {
        const foundPubkeys = validatorsData.map((v) => v.pubkey);
        const missingPubkeys = uniquePubkeys.filter(
          (pubkey) => !foundPubkeys.includes(pubkey),
        );

        return {
          valid: false,
          error: `Some validators do not exist: ${missingPubkeys.join(', ')}`,
        };
      }

      // Check if target pubkey exists in the results
      const targetValidator = validatorsData.find(
        (v) => v.pubkey === targetPubkey,
      );
      if (!targetValidator) {
        return {
          valid: false,
          error: `Target validator ${targetPubkey} not found`,
        };
      }

      // Check if all source pubkeys exist in the results
      for (const sourcePubkey of sourcePubkeys) {
        const sourceValidator = validatorsData.find(
          (v) => v.pubkey === sourcePubkey,
        );
        if (!sourceValidator) {
          return {
            valid: false,
            error: `Source validator ${sourcePubkey} not found`,
          };
        }
      }

      // Get the current epoch for consolidable check
      const currentEpoch = await this.fetchCurrentEpoch(network);

      // Extract the SHARD_COMMITTEE_PERIOD for consolidable check
      const shardCommitteePeriod = await this.getShardCommitteePeriod(network);

      // Check withdrawal credentials and consolidable status for each validator
      let withdrawalAddress: string | null = null;
      const invalidValidators: any[] = [];

      for (const validator of validatorsData) {
        // Extract credential type (first 4 chars, then last 2 chars of that)
        const credtype = validator.withdrawalcredentials
          ? validator.withdrawalcredentials.substring(0, 4).substring(2)
          : '';

        // Get activation epoch
        const activationEpoch =
          validator.activationepoch !== undefined
            ? parseInt(validator.activationepoch, 10)
            : Infinity;

        // Determine if consolidable based on:
        // 1. Credential type ('01' or '02')
        // 2. Activation epoch + shardCommitteePeriod < current epoch
        // 3. Validator status contains active
        const isConsolidable =
          ['01', '02'].includes(credtype) &&
          activationEpoch + shardCommitteePeriod < currentEpoch &&
          [
            ValidatorStatusEnum.active_online,
            ValidatorStatusEnum.active_offline,
            ValidatorStatusEnum.deposited,
          ].includes(validator.status);

        if (!isConsolidable) {
          invalidValidators.push({
            pubkey: validator.publickey,
            reason: 'Validator is not consolidable',
            details: {
              credtype,
              activationEpoch,
              currentEpoch,
              shardCommitteePeriod,
              status: validator.status,
            },
          });
          continue;
        }

        // Extract withdrawal address from credentials
        const currentWithdrawalAddress = this.extractWithdrawalAddress(
          validator.withdrawalcredentials,
        );

        if (!currentWithdrawalAddress) {
          invalidValidators.push({
            pubkey: validator.publickey,
            reason: 'Could not extract withdrawal address',
            credentials: validator.withdrawalcredentials,
          });
          continue;
        }

        // Compare with sender address
        if (currentWithdrawalAddress !== normalizedSenderAddress) {
          invalidValidators.push({
            pubkey: validator.publickey,
            reason: 'Withdrawal address does not match sender address',
            withdrawalAddress: currentWithdrawalAddress,
            senderAddress: normalizedSenderAddress,
          });
          continue;
        }

        // Store withdrawal address for consistency check
        if (withdrawalAddress === null) {
          withdrawalAddress = currentWithdrawalAddress;
        } else if (withdrawalAddress !== currentWithdrawalAddress) {
          invalidValidators.push({
            pubkey: validator.publickey,
            reason: 'Inconsistent withdrawal address across validators',
            expectedAddress: withdrawalAddress,
            actualAddress: currentWithdrawalAddress,
          });
        }
      }

      // If any validators failed validation, return error
      if (invalidValidators.length > 0) {
        return {
          valid: false,
          error: `Some validators failed validation`,
          validators: invalidValidators,
        };
      }

      // Success - all validators meet requirements
      return {
        valid: true,
        validators: validatorsData,
      };
    } catch (error) {
      this.logger.error(
        `Validation error for consolidation on ${network}: ${error.message}`,
      );
      return {
        valid: false,
        error: `Failed to validate consolidation requirements: ${error.message}`,
      };
    }
  }
}
