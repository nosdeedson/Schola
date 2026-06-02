import { RatingRepositoryInterface } from '../../../domain/rating/rating.repository.interface'
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { RatingEntity } from '../../../infrastructure/entities/rating/rating.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';

@Injectable()
export class RatingRepository implements RatingRepositoryInterface {
    private ratingRepository: Repository<RatingEntity>;
    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.ratingRepository = this.dataSource.getRepository(RatingEntity);
    }

    async create(entity: RatingEntity): Promise<RatingEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally {
            await queryRunner.release()
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(RatingEntity)
            .set({
                deletedAt: new Date()
            })
            .where('id= :id', { id: id })
            .execute();
    }

    async find(id: string): Promise<RatingEntity> {
        const model = await this.ratingRepository.findOne({
            where: { id: id },
            relations: {
                student: true
            }
        });
        return model;
    }

    async findAll(): Promise<RatingEntity[]> {
        const all = await this.ratingRepository.find();
        return all;
    }

    async findByStudentId(studentId: string): Promise<RatingEntity[]> {
        return await this.ratingRepository.find({
            where: {
                student: {
                    id: studentId
                },
                quarter: {
                    currentQuarter: true
                }
            },
            relations: {
                student: true,
                comments: true,
                quarter: true
            }
        });
    }

    async update(entity: RatingEntity) {
        await this.ratingRepository.save(entity)
    }

}
