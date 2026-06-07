import { RatingRepositoryInterface } from '../../../domain/rating/rating.repository.interface'
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { RatingEntity } from '../../../infrastructure/entities/rating/rating.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { Rating } from '@/domain/rating/rating';
import { RatingMapper } from '@/infrastructure/mappers/rating/rating-mapper';

@Injectable()
export class RatingRepository implements RatingRepositoryInterface {
    private ratingRepository: Repository<RatingEntity>;
    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.ratingRepository = this.dataSource.getRepository(RatingEntity);
    }

    async create(entity: RatingEntity): Promise<Rating> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return RatingMapper.fromEntity(result);
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

    async find(id: string): Promise<Rating> {
        const model = await this.ratingRepository.findOne({
            where: { id: id },
            relations: {
                student: true,
                comments: true,
                quarter: true,
            }
        });
        return RatingMapper.fromEntity(model);
    }

    async findAll(): Promise<Rating[]> {
        const all = await this.ratingRepository.find({
            relations: {
                student: true,
                comments: true,
                quarter: true
            }
        });
        return all.map(it => RatingMapper.fromEntity(it));
    }

    async findByStudentId(studentId: string): Promise<Rating[]> {
        const all = await this.ratingRepository.find({
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
        return all.map(it => RatingMapper.fromEntity(it));
    }

    async update(entity: RatingEntity) {
        await this.ratingRepository.save(entity)
    }

}
