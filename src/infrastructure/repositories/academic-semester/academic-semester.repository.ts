import { AcademicSemesterEntity } from '../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { AcademicSemesterRespositoryInterface } from '../../../domain/academc-semester/academic.semester.repository.interface';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';

@Injectable()
export class AcademicSemesterRepository implements AcademicSemesterRespositoryInterface {
    private academicRepositoryRepository: Repository<AcademicSemesterEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) { 
        this.academicRepositoryRepository = this.dataSource.getRepository(AcademicSemesterEntity);
    }

    async create(entity: AcademicSemesterEntity): Promise<AcademicSemesterEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error as any);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(AcademicSemesterEntity)
            .set({
                deletedAt: new Date()
            })
            .where('id= :id', { id: id })
            .execute()
    }

    async find(id: string): Promise<AcademicSemesterEntity> {
        const model = await this.academicRepositoryRepository.findOne({
            where: { id: id },
            relations: {
                quarters: true
            }
        })
        return model;
    }

    async findAll(): Promise<AcademicSemesterEntity[]> {
        return await this.academicRepositoryRepository.find({
            relations: ['quarters']
        });
    }

    async findCurrentSemester(): Promise<AcademicSemesterEntity> {
        return await this.academicRepositoryRepository.findOne({
            where: { current: true },
        });
    }

    async update(entity: AcademicSemesterEntity) {
        await this.academicRepositoryRepository.save(entity);
    }

}
