import { AccessType } from "@/domain/user/access.type";
import { CreateUserRequestDto } from "@/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";

export class InputCreateUserDto{
    
    person: PersonEntity;
    email: string;
    password: string;
    nickname:string;
    accesstype: AccessType;

    constructor(dto: CreateUserRequestDto, person: PersonEntity){
        this.person = person;
        this.email = dto?.email;
        this.password = dto?.password;
        this.nickname = dto?.nickname;
        this.accesstype = dto?.accessType;
    }
}