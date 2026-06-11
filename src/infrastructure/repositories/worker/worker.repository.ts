import { DataSource, QueryFailedError, Repository } from "typeorm";
import { WorkerRepositoryInterface } from "../../../domain/worker/worker.repository.interface";
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { Worker } from "@/domain/worker/worker";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";

@Injectable()
export class WorkerRepository implements WorkerRepositoryInterface {

    private workerRespository: Repository<WorkerEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.workerRespository = this.dataSource.getRepository(WorkerEntity);
    }

    async create(entity: WorkerEntity): Promise<Worker> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return WorkerMapper.fromEntity(result);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(WorkerEntity)
            .set({ deletedAt: new Date() })
            .where("id= :id", { id: id })
            .execute();
    }

    async find(id: string): Promise<Worker> {
        let worker = await this.workerRespository.findOne({
            where: { id: id },
            relations: {
                classes: true
            }
        });
        return WorkerMapper.fromEntity(worker);
    }

    async findAll(): Promise<Worker[]> {
        let all = await this.workerRespository.find();
        return all.map(it => WorkerMapper.fromEntity(it));
    }

    async findByName(name: string): Promise<Worker> {
        if (!name) return null;
        const result = await this.workerRespository.createQueryBuilder('worker')
            .where('UPPER(worker.fullName) = :name', { name: name.toUpperCase() })
            .getOne();
        return WorkerMapper.fromEntity(result);
    }

    async update(entity: WorkerEntity) {
        await this.workerRespository.save(entity);
    }

}
