import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { CommentRepositoryInterface } from '../../../domain/comment/comment.repository.interface';
import { CommentEntity } from '../../../infrastructure/entities/comment/comment.entity';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { Inject } from '@nestjs/common';


export class CommentRepository implements CommentRepositoryInterface {
    private commentRepository: Repository<CommentEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.commentRepository = this.dataSource.getRepository(CommentEntity)
     }

    async create(entity: CommentEntity): Promise<CommentEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error: any) {
            console.log(error)
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(CommentEntity)
            .set({
                deletedAt: new Date()
            })
            .where('id= :id', { id: id })
            .execute();
    }

    async find(id: string): Promise<CommentEntity> {
        const model = await this.commentRepository.findOne({
            where: { id: id }
        })
        return model;
    }

    async findAll(): Promise<CommentEntity[]> {
        return await this.commentRepository.find();
    }

    async update(entity: CommentEntity) {
        await this.commentRepository.save(entity);
    }

}
