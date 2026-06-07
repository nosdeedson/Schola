import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { StudentRepositoryInterface } from '../../../domain/student/student.repository.interface';
import { StudentEntity } from '../../../infrastructure/entities/student/student.entity';
import { ParentStudentEntity } from '@/infrastructure/entities/parent-student/parent.student.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { Student } from '@/domain/student/student';
import { StudentMapper } from '@/infrastructure/mappers/student/student-mapper';

@Injectable()
export class StudentRepository implements StudentRepositoryInterface {
    private studentRepository: Repository<StudentEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.studentRepository = this.dataSource.getRepository(StudentEntity);
    }

    async create(entity: StudentEntity): Promise<Student> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return StudentMapper.fromEntity(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error as any);
        } finally {
            queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        // TODO is not softdeleting the student
        const student = await this.studentRepository.delete(id)
    }

    async find(id: string): Promise<Student> {
        const entity = await this.studentRepository.findOne({
            where: { id: id, },
            relations: {
                schoolGroup: true,
            }
        });
        return StudentMapper.fromEntity(entity);
    }

    async findByIds(studentIds: string[]): Promise<Student[]> {
        const all = await this.studentRepository.find({
            where: {
                id: In(studentIds)
            }
        });
        return all.map(it => StudentMapper.fromEntity(it));
    }

    async findStudentByNameAndParentNames(studentName: string, parentNames: string[]): Promise<Student> {
        const qb = this.dataSource.createQueryBuilder(ParentStudentEntity, 'ps')
            .innerJoin('ps.student', 'student')
            .innerJoin('ps.parent', 'parent')
            .where('student.fullName = :studentName', { studentName })
            .andWhere('parent.fullName IN (:...parentNames)', { parentNames })
            .andWhere('student.type = :type', { type: 'student' })
            .select('student')
            .distinct(true);
        const s = await qb.getRawOne();
        return s ? StudentMapper.fromEntity(await this.studentRepository.findOneBy({ id: s.student_id })) : null;
    }

    async findAll(): Promise<Student[]> {
        const all = await this.studentRepository.find({
            relations: {
                schoolGroup: true
            }
        });
        return all.map(it => StudentMapper.fromEntity(it));
    }

    async update(entity: StudentEntity) {
        await this.studentRepository.save(entity);
    }

    async updateAll(students: StudentEntity[]) {
        await this.studentRepository.save(students);
    }

}
