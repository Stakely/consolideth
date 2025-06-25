import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';
import { BeaconChainService } from './beacon-chain.service';
import { NetworkConfigService } from './network-config.service';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private web3Instances: Map<string, Web3> = new Map();
  private rpcUrls: { [key: string]: string };
  private consolidationAbi: any;

  constructor(
    private configService: ConfigService,
    private beaconChainService: BeaconChainService,
    private networkConfigService: NetworkConfigService,
  ) {
    this.rpcUrls = this.configService.get('eth.rpcUrls', {
      infer: true,
    }) as { [key: string]: string };

    // Initialize Web3 instances for each network
    this.initializeWeb3Instances();

    // Load ABI files
    this.loadAbis();
  }

  private initializeWeb3Instances() {
    for (const [network, rpcUrl] of Object.entries(this.rpcUrls)) {
      this.web3Instances.set(network, new Web3(rpcUrl));
      this.logger.log(`Initialized Web3 instance for ${network}: ${rpcUrl}`);
    }
  }

  private getWeb3Instance(network: string): Web3 {
    const web3Instance = this.web3Instances.get(network);
    if (!web3Instance) {
      throw new Error(`Web3 instance not found for network: ${network}`);
    }
    return web3Instance;
  }

  private loadAbis() {
    try {
      // In development: src/eth/services -> src/eth/abi
      // In production: dist/src/eth/services -> dist/eth/abi
      const isProduction = __dirname.includes('dist');

      let consolidationAbiPath: string;

      if (isProduction) {
        // In production, files are in dist/eth/abi/
        consolidationAbiPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'eth',
          'abi',
          'consolidation-abi.json',
        );
      } else {
        // In development, files are in src/eth/abi/
        consolidationAbiPath = path.join(
          __dirname,
          '..',
          'abi',
          'consolidation-abi.json',
        );
      }

      const fileContentConsolidation = fs.readFileSync(
        consolidationAbiPath,
        'utf8',
      );
      this.consolidationAbi = JSON.parse(fileContentConsolidation);
    } catch (error) {
      this.logger.error(`Failed to load ABI files: ${error.message}`);
      this.consolidationAbi = [];
    }
  }

  /**
   * Get the current block number
   */
  public async getBlockNumber(network: string = 'mainnet'): Promise<number> {
    const web3 = this.getWeb3Instance(network);
    return Number(await web3.eth.getBlockNumber());
  }

  /**
   * Get the balance of an Ethereum address
   * @param address The Ethereum address to check
   * @param network The network to use
   */
  public async getBalance(
    address: string,
    network: string = 'mainnet',
  ): Promise<string> {
    const web3 = this.getWeb3Instance(network);
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  }

  public remove0xPrefix(hex: string): string {
    return hex.startsWith('0x') ? hex.substring(2) : hex;
  }

  public async buildTxObject(
    txData: string,
    to: string,
    sender: string,
    network: string,
    value: bigint = BigInt(0),
    gas: number = 91000,
  ) {
    const web3 = this.getWeb3Instance(network);
    // const nonce = await web3.eth.getTransactionCount(sender);
    const chainId = await web3.eth.getChainId();
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceFast = Math.round(Number(gasPrice) * 1.2);
    const txObject: any = {
      sender: sender,
      from: sender,
      // nonce,
      to,
      value: web3.utils.toHex(BigInt(value)),
      gas: web3.utils.toHex(BigInt(gas)),
      gasPrice: web3.utils.toHex(gasPriceFast),
      data: txData,
      chainId: web3.utils.toHex(chainId),
    };

    return txObject;
  }

  /**
   * Sign and send a transaction using the owner's private key
   * @param txObject Transaction object to send
   *
   * This method has been commented out as it requires the private key
   * which should now be managed by the external client
   */
  // public async signAndSendTransaction(txObject: any): Promise<any> {
  //   if (!this.ownerPrivateKey) {
  //     throw new Error('Owner private key not set');
  //   }

  //   // Sign transaction
  //   const signedTx = await this.web3.eth.accounts.signTransaction(
  //     txObject,
  //     this.ownerPrivateKey,
  //   );

  //   // Send transaction
  //   const txHash = await this.web3.eth.sendSignedTransaction(
  //     signedTx.rawTransaction,
  //   );
  //   return txHash;
  // }

  public async getConsolidationFee(network: string): Promise<bigint> {
    const networkConfig = this.networkConfigService.getNetworkConfig(network);
    let requiredFee = 0n;

    try {
      const queueLength = await this.getStorageAt(
        networkConfig.consolidationContractAddress,
        '0x00',
        network,
      );
      this.logger.log(`Queue length: ${queueLength}`);

      if (
        queueLength &&
        queueLength !==
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ) {
        requiredFee = this.getRequiredFee(BigInt(queueLength));
      }
    } catch (error) {
      this.logger.error(`Error getting queue length: ${error.message}`);
    }

    return requiredFee;
  }

  public async getStorageAt(
    contractAddress: string,
    slot: string,
    network: string,
  ) {
    const web3 = this.getWeb3Instance(network);
    try {
      // Get the value at a specific storage slot
      const value = await web3.eth.getStorageAt(
        contractAddress,
        slot,
        'latest',
      );

      // Convert the hex value to a decimal number if needed
      const valueAsDecimal = web3.utils.hexToNumber(value);

      this.logger.log('Raw storage value (hex):', value);
      this.logger.log('Storage value (decimal):', valueAsDecimal);

      return value;
    } catch (error) {
      this.logger.error('Error reading storage:', error);
      throw error;
    }
  }

  public validateAndFormatPubkey(pubkeyHex: string) {
    // Remove 0x prefix if present
    const cleanPubkey = pubkeyHex.startsWith('0x')
      ? pubkeyHex.substring(2)
      : pubkeyHex;

    // Check if it's exactly 96 hex characters (48 bytes)
    if (cleanPubkey.length !== 96) {
      throw new Error(
        `Invalid pubkey length: expected 96 hex chars (48 bytes), got ${cleanPubkey.length}`,
      );
    }

    // Check if it consists of valid hex characters
    if (!/^[0-9a-fA-F]+$/.test(cleanPubkey)) {
      throw new Error('Invalid pubkey: contains non-hex characters');
    }

    // Return the formatted pubkey with 0x prefix
    return '0x' + cleanPubkey;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async prepareConsolidations(
    targetPubkey: string,
    sourcePubkeys: string[],
    fee: bigint,
    network: string,
  ): Promise<any[]> {
    const networkConfig = this.networkConfigService.getNetworkConfig(network);
    const callDatas: any[] = [];

    for (const sourcePubkey of sourcePubkeys) {
      const data =
        '0x' +
        this.remove0xPrefix(sourcePubkey) +
        this.remove0xPrefix(targetPubkey);
      callDatas.push({
        sourcePubkey,
        targetPubkey,
        payload: {
          data,
          address: networkConfig.consolidationContractAddress,
          value: fee,
        },
      });
    }

    return callDatas;
  }

  public getRequiredFee(numerator: bigint): bigint {
    // https://eips.ethereum.org/EIPS/eip-7251#fee-calculation
    let i = 1n;
    let output = 0n;
    let numeratorAccum = 1n * 17n; // factor * denominator

    while (numeratorAccum > 0n) {
      output += numeratorAccum;
      numeratorAccum = (numeratorAccum * numerator) / (17n * i);
      i += 1n;
    }

    return output / 17n;
  }

  /**
   * Generate transaction payloads without actually sending them
   * Automatically checks if the target validator needs conversion from BLS to execution credentials
   */
  public async generateConsolidationPayloads(
    targetPubkey: string,
    sourcePubkeys: string[],
    sender: string,
    network: string,
  ): Promise<any[]> {
    try {
      const networkConfig = this.networkConfigService.getNetworkConfig(network);
      const fee = await this.getConsolidationFee(network);
      this.logger.log(`Consolidation fee: ${fee}`);

      // Special case: if there's only 1 source and it's the same as target (self-consolidation)
      if (sourcePubkeys.length === 1 && sourcePubkeys[0] === targetPubkey) {
        this.logger.log(
          'Detected self-consolidation (target = source), checking for credential conversion need',
        );

        // Validate the validator first using the beacon chain service
        const validation =
          await this.beaconChainService.validateConsolidationRequirements(
            targetPubkey,
            sourcePubkeys,
            sender,
            network,
          );

        if (!validation.valid) {
          throw new Error(`Validator validation failed: ${validation.error}`);
        }

        // Get the target validator's credential type
        const targetCredType =
          await this.beaconChainService.getValidatorCredentialType(
            targetPubkey,
            network,
          );

        this.logger.log(
          `Self-consolidation validator credential type: ${targetCredType}`,
        );

        // Check if validator is consolidable and has credential type 01
        if (!targetCredType || targetCredType === '') {
          throw new Error(
            `Cannot determine credential type for validator ${targetPubkey}`,
          );
        }

        if (targetCredType !== '01') {
          throw new Error(
            `Self-consolidation is only allowed for validators with credential type 01 (BLS credentials). ` +
              `Validator ${targetPubkey} has credential type ${targetCredType}`,
          );
        }

        // Since it's type 01, it needs conversion to type 02
        this.logger.log(
          'Validator needs conversion from type 01 to type 02, generating conversion payload',
        );

        // Create a self-consolidation transaction for credential conversion
        const conversionCallData = {
          data:
            '0x' +
            this.remove0xPrefix(targetPubkey) +
            this.remove0xPrefix(targetPubkey),
          address: networkConfig.consolidationContractAddress,
          value: fee,
        };

        const conversionPayload = await this.buildTxObject(
          conversionCallData.data,
          networkConfig.consolidationContractAddress,
          sender,
          network,
          conversionCallData.value,
          91000,
        );

        // Return only the conversion payload
        return [
          {
            payload: conversionPayload,
            isConversionTx: true,
            isSelfConsolidation: true,
            description:
              'Self-consolidation: conversion from BLS (01) to execution (02) credentials',
            sourcePubkey: targetPubkey,
            targetPubkey: targetPubkey,
          },
        ];
      }

      // Regular consolidation flow (multiple sources or different target)
      // Get the target validator's credential type from the beacon chain
      const targetCredType =
        await this.beaconChainService.getValidatorCredentialType(
          targetPubkey,
          network,
        );
      this.logger.log(`Target validator credential type: ${targetCredType}`);

      // Prepare consolidations between source validators and target
      const callDatas = await this.prepareConsolidations(
        targetPubkey,
        sourcePubkeys,
        fee,
        network,
      );

      // Final payloads to return
      const payloads: any[] = [];

      // Check if target needs conversion from BLS to execution credentials
      // Type 02 is execution layer credentials, which is required for consolidation target
      const needsTypeConversion = targetCredType && targetCredType !== '02';

      if (needsTypeConversion) {
        this.logger.log(
          `Target validator has credential type ${targetCredType}, needs conversion to type 02`,
        );

        // Create a self-consolidation transaction for the target to convert its type
        const conversionCallData = {
          data:
            '0x' +
            this.remove0xPrefix(targetPubkey) +
            this.remove0xPrefix(targetPubkey),
          address: networkConfig.consolidationContractAddress,
          value: fee,
        };

        // For single transactions, add the conversion tx
        const conversionPayload = await this.buildTxObject(
          conversionCallData.data,
          networkConfig.consolidationContractAddress,
          sender,
          network,
          conversionCallData.value,
          91000,
        );

        payloads.push({
          payload: conversionPayload,
          isConversionTx: true,
          description:
            'Conversion transaction to change target validator credential type to 02',
          sourcePubkey: targetPubkey,
          targetPubkey: targetPubkey,
        });
      }

      // Generate individual transaction payloads
      for (const callData of callDatas) {
        const txObject = await this.buildTxObject(
          callData.payload.data,
          networkConfig.consolidationContractAddress,
          sender,
          network,
          callData.payload.value,
          91000,
        );

        payloads.push({
          payload: txObject,
          isConversionTx: false,
          description: 'Consolidation transaction for single validator',
          sourcePubkey: callData.sourcePubkey,
          targetPubkey: callData.targetPubkey,
        });
      }

      return payloads;
    } catch (error: any) {
      this.logger.error('Failed to generate consolidation payloads:', error);
      throw new Error(
        `Failed to generate consolidation payloads: ${error.message}`,
      );
    }
  }
}
