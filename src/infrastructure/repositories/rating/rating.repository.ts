import { Rating } from '@/domain/rating/rating';
import { RatingRepositoryInterface } from '../../../domain/rating/rating.repository.interface'
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { RatingEntity } from '../../../infrastructure/entities/rating/rating.entity';


export class RatingRepositiry implements RatingRepositoryInterface{

    constructor(
        private ratingRepository: Repository<RatingEntity>,
        private dataSource: DataSource
    ){}

    async create(entity: RatingEntity): Promise<RatingEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally{
            await queryRunner.release()
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(RatingEntity)
            .set({
                deletedAt : new Date()
            })
            .where('id= :id', { id: id })
            .execute();
    }

    async find(id: string): Promise<RatingEntity> {
        const model = await this.ratingRepository.findOne({
            where: {id: id},
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

    async update(entity: RatingEntity) {
        await this.ratingRepository.save(entity)
    }

}