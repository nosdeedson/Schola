import { ParentEntity } from '../../../infrastructure/entities/parent/parent.entity';
import { ParentReporitoryInterface } from '../../../domain/parent/parent.repository.interface';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { ParentStudentEntity } from '@/infrastructure/entities/parent-student/parent.student.entity';


export class ParentRepository implements ParentReporitoryInterface {

    constructor(
        private parentRepository: Repository<ParentEntity>,
        private dataSource: DataSource
    ) { }

    async create(entity: ParentEntity): Promise<ParentEntity> {
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
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(ParentEntity)
            .set({
                deletedAt: new Date()
            })
            .where('id= :id', { id: id })
            .execute();
    }

    async find(id: string): Promise<ParentEntity> {
        const model = await this.parentRepository.findOne({
            where: { id: id },
        })
        return model;
    }

    async findByParentNameAndStudentNames(nameParent: string, studentNames: string[]): Promise<ParentEntity> {
        const qb = this.dataSource.createQueryBuilder(ParentStudentEntity, 'ps')
            .innerJoin('ps.parent', 'parent')
            .innerJoin('ps.student', 'student')
            .where('UPPER(parent.fullName) = :nameParent', { nameParent: nameParent.toUpperCase() })
            .andWhere('UPPER(student.fullName) IN (:...studentNames)', { studentNames: studentNames.map(n => n.toUpperCase()) })
            .select('parent')
            .distinct(true);
        const p = await qb.getRawOne();
        return p ? this.parentRepository.findOneBy({ id: p.parent_id }) : null;
    }

    async findAll(): Promise<ParentEntity[]> {
        return await this.parentRepository.find()
    }

    async update(entity: ParentEntity) {
        await this.parentRepository.save(entity)
    }

}

