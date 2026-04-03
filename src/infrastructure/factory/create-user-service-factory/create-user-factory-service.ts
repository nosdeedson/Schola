import { Injectable } from '@nestjs/common';
import { CreateGenericService } from 'src/application/services/@shared/create-generic-service';
import { CreateWorkerService } from 'src/application/services/worker/create/create.worker.service';
import { AccessType } from '@/domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { CreateParentStudentService } from 'src/application/services/parent-student/create/create.parent.student.service';

@Injectable()
export class CreateUserFactoryService {

    constructor(private readonly userAggregateContext: UserAggregateResolverService) { }

    public createUserServiceFactory(accessType: AccessType): CreateGenericService {
        try {
            const context = this.userAggregateContext.resolve(accessType);
            switch (context.accessType) {
                case AccessType.PARENT:
                case AccessType.STUDENT:
                    return new CreateParentStudentService({
                        classRepository: context.classRepository, 
                        parentRepository: context.parentRepository, 
                        parentStudentRepository: context.parentStudentRepository,
                        studentRepository: context.studentRepository,
                    });
                case AccessType.TEACHER:
                case AccessType.ADMIN:
                    return new CreateWorkerService(context.workerRepository, context.classRepository);
                default:
                    throw new Error('Invalid access type');
            }
        } catch (error) {
            throw error;
        }
    }
}
