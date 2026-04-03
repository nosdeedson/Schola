import { AccessType } from "@/domain/user/access.type";
import { RoleEnum } from "../../../../domain/worker/roleEnum";

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