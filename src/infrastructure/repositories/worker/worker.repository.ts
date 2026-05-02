import { DataSource, QueryFailedError, Repository } from "typeorm";
import { WorkerRepositoryInterface } from "../../../domain/worker/worker.repository.interface";
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";

@Injectable()
export class WorkerRepository implements WorkerRepositoryInterface {

    private workerRespository: Repository<WorkerEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.workerRespository = this.dataSource.getRepository(WorkerEntity);
    }

    async create(entity: WorkerEntity): Promise<WorkerEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error: any) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        this.dataSource.createQueryBuilder()
            .update(WorkerEntity)
            .set({ deletedAt: new Date() })
            .where("id= :id", { id: id })
            .execute();
    }

    async find(id: string): Promise<WorkerEntity> {
        let worker = await this.workerRespository.findOne({
            where: { id: id },
            relations: {
                classes: true
            }
        });
        return worker;
    }

    async findAll(): Promise<WorkerEntity[]> {
        let all = await this.workerRespository.find();
        return all;
    }

    async findByName(name: string): Promise<WorkerEntity> {
        return this.workerRespository.createQueryBuilder('worker')
            .where('UPPER(worker.fullName) = :name', { name: name.toUpperCase() })
            .getOne();
    }

    async update(entity: WorkerEntity) {
        await this.workerRespository.save(entity);
    }

}
