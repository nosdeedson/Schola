import { AccessType } from "@/domain/user/access.type";

export class FindUserDto{
    id: string;
    personId: string;
    email: string;
    nickname: string;
    name: string;
    accessType: AccessType;

    constructor(
        id: string,
        personId: string,
        email: string,
        nickname: string,
        name: string,
        accessType: AccessType
    ) {
        this.id = id;
        this.personId = personId;
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.accessType = accessType;
    }
}