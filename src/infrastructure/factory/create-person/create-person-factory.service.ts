import { Injectable } from '@nestjs/common';
import { SystemError } from 'src/application/services/@shared/system-error';
import { CreateParentDto } from 'src/application/services/parent/create/create.parent.dto';
import { CreateStudentDto } from 'src/application/services/student/create/create.student.dto';
import { CreateWorkerDto } from 'src/application/services/worker/create/create.worker.dto';
import { AccessType } from '@/domain/user/access.type';
import { CreateUserRequestDto } from '@/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto';

export type GenericPersonDto = 
 | CreateWorkerDto
 | CreateStudentDto
 | CreateParentDto;

@Injectable()
export class CreatePersonFactoryService {

    public static createDTOPersonFactory(dto: CreateUserRequestDto): any {
        switch (dto.accessType) {
            case AccessType.PARENT:
                return new CreateParentDto(new Date(dto.birthDate), dto.name, dto.students);
            case AccessType.STUDENT:
                return new CreateStudentDto(new Date(dto.birthDate), dto.name, dto.classCode, dto.parents);
            case AccessType.ADMIN:
            case AccessType.TEACHER:
                return new CreateWorkerDto(dto);
            default:
                throw new SystemError([{ context: 'CreatePersonFactoryService', message: 'Invalid access type' }]);
        }
    }
}
