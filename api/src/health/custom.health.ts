// src/custom.health.ts
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isMigrationRunning = await this.checkMigrations();
    const isSeedRunning = await this.checkSeed();

    const result = this.getStatus(
      key,
      isMigrationRunning === false && isSeedRunning === false,
      {
        migrationsRunning: isMigrationRunning,
        seedRunning: isSeedRunning,
      },
    );

    if (isMigrationRunning || isSeedRunning) {
      throw new HealthCheckError('Health check failed', result);
    }
    return result;
  }

  private async checkMigrations(): Promise<boolean> {
    const pendingMigrations = await this.dataSource.showMigrations();
    return pendingMigrations;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async checkSeed(): Promise<boolean> {
    const dataFilePath = path.resolve(
      'src/database/seeds/relational/seeding-status.json',
    );

    const seedStatus = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    return seedStatus.status;
  }
}
