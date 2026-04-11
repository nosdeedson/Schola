import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { StudentRepositoryInterface } from '../../../domain/student/student.repository.interface';
import { StudentEntity } from '../../../infrastructure/entities/student/student.entity';
import { ParentStudentEntity } from '@/infrastructure/entities/parent-student/parent.student.entity';


export class StudentRepository implements StudentRepositoryInterface {

    constructor(
        private studentRepository: Repository<StudentEntity>,
        private dataSource: DataSource
    ) { }

    async create(entity: StudentEntity): Promise<StudentEntity> {
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
            throw new QueryFailedError(null, null, error as any);
        }
    }

    async delete(id: string): Promise<void> {
        // TODO is not softdeleting the student
        const student = await this.studentRepository.delete(id)
    }

    async find(id: string): Promise<StudentEntity> {
        return await this.studentRepository.findOne({
            where: { id: id, },
            relations: {
                schoolGroup: true,
            }
        });
    }

    async findByIds(studentIds: string[]): Promise<StudentEntity[]> {
        return await this.studentRepository.find({
            where: {
                id: In(studentIds)
            }
        })
    }

    async findStudentByNameAndParentNames(studentName: string, parentNames: string[]): Promise<StudentEntity> {
        const qb = this.dataSource.createQueryBuilder(ParentStudentEntity, 'ps')
            .innerJoin('ps.student', 'student')
            .innerJoin('ps.parent', 'parent')
            .where('student.fullName = :studentName', { studentName })
            .andWhere('parent.fullName IN (:...parentNames)', { parentNames })
            .andWhere('student.type = :type', { type: 'student' })
            .select('student')
            .distinct(true);
        const s = await qb.getRawOne();
        return s ? this.studentRepository.findOneBy({ id: s.student_id }) : null;
    }

    async findAll(): Promise<StudentEntity[]> {
        return await this.studentRepository.find({
            relations: {
                schoolGroup: true
            }
        });
    }

    async update(entity: StudentEntity) {
        await this.studentRepository.save(entity);
    }

    async updateAll(students: StudentEntity[]) {
        await this.studentRepository.save(students);
    }

}
