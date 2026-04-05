import { Injectable } from '@nestjs/common';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { AccessType } from '@/domain/user/access.type';
import { SystemError } from '@/application/services/@shared/system-error';
import { FindParentService } from '@/application/services/parent/find/find.parent.service';
import { FindStudentService } from '@/application/services/student/find/find.student.service';
import { FindWorkerService } from '@/application/services/worker/find/find.worker.service';

@Injectable()
export class FindUserFactoryService {
    constructor(private userAggregateResolver: UserAggregateResolverService) { }

    async findUserServiceFactory(accessType: AccessType) {
        const context = this.userAggregateResolver.resolve(accessType);
        switch (context.accessType) {
            case AccessType.PARENT:
                return new FindParentService(context.parentRepository);
            case AccessType.STUDENT:
                return new FindStudentService(context.studentRepository);
            case AccessType.TEACHER:
            case AccessType.ADMIN:
                return new FindWorkerService(context.workerRepository);
            default:
                throw new SystemError([{ context: "find User", message: 'fail to create service to find user' }]);
        }
    }
}
