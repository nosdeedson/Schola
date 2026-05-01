import { Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DATA_SOURCE } from '../data-base-connection/data-base-connection.module';

@Injectable()
export class TransactionService {

    constructor(
        @Inject(DATA_SOURCE)
        private readonly dataSource: DataSource
    ){}

    async runInTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T>{
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await callback(queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
