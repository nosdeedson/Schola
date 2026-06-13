import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { CommentRepositoryInterface } from '../../../domain/comment/comment.repository.interface';
import { CommentEntity } from '../../../infrastructure/entities/comment/comment.entity';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { Inject } from '@nestjs/common';
import { Comment } from '@/domain/comment/comment';
import { CommentMapper } from '@/infrastructure/mappers/comment/comment-mapper';


export class CommentRepository implements CommentRepositoryInterface {
    private commentRepository: Repository<CommentEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.commentRepository = this.dataSource.getRepository(CommentEntity)
    }

    async create(entity: CommentEntity): Promise<Comment> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return CommentMapper.fromEntity(result);
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

    async find(id: string): Promise<Comment> {
        const entity = await this.commentRepository.findOne({
            where: { id: id },
            relations: { rating: true }
        });
        return CommentMapper.fromEntity(entity);
    }

    async findAll(): Promise<Comment[]> {
        const all = await this.commentRepository.find();
        return all.map(it => CommentMapper.fromEntity(it));
    }

    async update(entity: CommentEntity) {
        await this.commentRepository.save(entity);
    }

}
