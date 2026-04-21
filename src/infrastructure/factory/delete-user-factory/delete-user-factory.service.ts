import { Injectable } from '@nestjs/common';
import { DeleteGenericService } from '@/application/services/@shared/delete-generic-service';
import { SystemError } from '@/application/services/@shared/system-error';
import { DeleteParentService } from '@/application/services/parent/delete/delete.parent.service';
import { DeleteStudentService } from '@/application/services/student/delete/delete.student.service';
import { DeleteWorkerService } from '@/application/services/worker/delete/delete.worker.service';
import { AccessType } from '@/domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { DeleteUserFactoryInterface } from '@/interfaces/factory/delete-user-factory.interface';

@Injectable()
export class DeleteUserFactoryService implements DeleteUserFactoryInterface {

    constructor(private userAggregateContext: UserAggregateResolverService) { }

    public deleteUserServiceFactory(accessType: AccessType): DeleteGenericService {
        const context = this.userAggregateContext.resolve(accessType);
        switch (context.accessType) {
            case AccessType.PARENT:
                return new DeleteParentService(context.parentRepository);
            case AccessType.STUDENT:
                return new DeleteStudentService(context.studentRepository);
            case AccessType.TEACHER:
            case AccessType.ADMIN:
                return new DeleteWorkerService(context.workerRepository);
            default:
                throw new SystemError([{ context: "delete User", message: 'fail to create service to delete' }]);
        }
    }

}
