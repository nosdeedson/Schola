import { Injectable } from '@nestjs/common';
import { DeleteGenericService } from 'src/application/services/@shared/delete-generic-service';
import { SystemError } from 'src/application/services/@shared/system-error';
import { DeleteParentService } from 'src/application/services/parent/delete/delete.parent.service';
import { DeleteStudentService } from 'src/application/services/student/delete/delete.student.service';
import { DeleteWorkerService } from 'src/application/services/worker/delete/delete.worker.service';
import { AccessType } from '@/domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';

@Injectable()
export class DeleteUserFactoryService {

    constructor( private userAggregateContext: UserAggregateResolverService){}

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
                throw new SystemError([{context: "delete User", message: 'fail to create service to delete'}]);
        }
    }

}
