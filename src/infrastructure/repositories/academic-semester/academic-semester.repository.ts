import { AcademicSemesterEntity } from '../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { AcademicSemesterRespositoryInterface } from '../../../domain/academc-semester/academic.semester.repository.interface';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { AcademicSemester } from '@/domain/academc-semester/academic.semester';
import { AcademicSemesterMapper } from '@/infrastructure/mappers/semester/academic-semester-mapper';

@Injectable()
export class AcademicSemesterRepository implements AcademicSemesterRespositoryInterface {
    private academicRepositoryRepository: Repository<AcademicSemesterEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.academicRepositoryRepository = this.dataSource.getRepository(AcademicSemesterEntity);
    }

    async create(entity: AcademicSemesterEntity): Promise<AcademicSemester> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return AcademicSemesterMapper.fromEntity(result);
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

    async find(id: string): Promise<AcademicSemester> {
        const model = await this.academicRepositoryRepository.findOne({
            where: { id: id },
            relations: {
                quarters: true
            }
        })
        return AcademicSemesterMapper.fromEntity(model);
    }

    async findAll(): Promise<AcademicSemester[]> {
        const entities = await this.academicRepositoryRepository.find({
            relations: ['quarters']
        });
        return entities.map(it => AcademicSemesterMapper.fromEntity(it));
    }

    async findCurrentSemester(): Promise<AcademicSemester> {
        const entity = await this.academicRepositoryRepository.findOne({
            where: { current: true },
            relations: {
                quarters: true
            },
        });
        if (!entity) return null;
        return AcademicSemesterMapper.fromEntity(entity);
    }

    async update(entity: AcademicSemesterEntity) {
        await this.academicRepositoryRepository.save(entity);
    }

}
