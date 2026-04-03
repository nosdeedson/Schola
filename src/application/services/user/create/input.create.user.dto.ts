import { AccessType } from "@/domain/user/access.type";
import { CreateUserRequestDto } from "@/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto";

export class InputCreateUserDto{
    
    personId: string;
    email: string;
    password: string;
    nickname:string;
    accesstype: AccessType;

    constructor(dto: CreateUserRequestDto, idPerson: string){
        this.personId = idPerson;
        this.email = dto?.email;
        this.password = dto?.password;
        this.nickname = dto?.nickname;
        this.accesstype = dto?.accessType == AccessType.ADMIN ? AccessType.ADMIN : AccessType.TEACHER;
    }
}