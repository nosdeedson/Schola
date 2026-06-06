import { Inject, Injectable } from '@nestjs/common';
import { AcademicSemesterRepository } from '@/infrastructure/repositories/academic-semester/academic-semester.repository';
import { DataSource } from 'typeorm';
import { TypeRepository } from './type-repository';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { StudentRepository } from '@/infrastructure/repositories/student/student.repository';
import { CommentRepository } from '@/infrastructure/repositories/comment/comment.respository';
import { ParentRepository } from '@/infrastructure/repositories/parent/parent.repository';
import { RatingRepository } from '@/infrastructure/repositories/rating/rating.repository';
import { UserRepository } from '@/infrastructure/repositories/user/user.repository';
import { WorkerRepository } from '@/infrastructure/repositories/worker/worker.repository';
import { SystemError } from '@/application/services/@shared/system-error';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';
import { DATA_SOURCE } from '@/infrastructure/data-base-connection/data-base-connection.module';

@Injectable()
export class RepositoryFactoryService {

    constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) { }

    public createRepository(whichRepository: TypeRepository): any {
        switch (whichRepository) {
            case TypeRepository.ACADEMIC_SEMESTER:
                return new AcademicSemesterRepository(this.dataSource);
            case TypeRepository.CLASS:
                return new ClassRepository(this.dataSource) as ClassRepository;
            case TypeRepository.COMMENT:
                return new CommentRepository(this.dataSource);
            case TypeRepository.PARENT:
                return new ParentRepository(this.dataSource);
            case TypeRepository.PARENT_STUDENT:
                return new ParentStudentRepository(this.dataSource);
            case TypeRepository.RATING:
                return new RatingRepository(this.dataSource);
            case TypeRepository.STUDENT:
                return new StudentRepository(this.dataSource);
            case TypeRepository.USER:
                return new UserRepository(this.dataSource);
            case TypeRepository.WORKER:
                return new WorkerRepository(this.dataSource);
            default:
                throw new SystemError([{ context: 'RepositoryFactory', message: "Erro while creating repository." }], 500)
        }
    }
}
