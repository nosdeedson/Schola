import { AccessType } from "src/domain/user/access.type";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { CreateUserRequestDto } from "src/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto";

export class CreateWorkerDto {
    name: string;
    birthday?: Date;
    role: RoleEnum;
    classCode: string;

    constructor(params: {
        name: string,
        birthday?: Date,
        accessType?: AccessType,
        classCode: string,
    }){
        this.name = params.name;
        this.birthday = params.birthday ? new Date(params.birthday) : undefined;
        this.role = params.accessType === AccessType.ADMIN ? RoleEnum.ADMINISTRATOR : RoleEnum.TEACHER;
        this.classCode = params.classCode;
    }
}