import { FindUserDto } from "@/application/services/user/find/find.user.dto";
import { FindAllUserDto } from "@/application/services/user/findAll/findAll.user.dto";
import { AccessType } from "@/domain/user/access.type";
import { RoleEnum } from "@/domain/worker/roleEnum";

export class FindUserResponseDto {
    id: string;
    email: string;
    name: string;
    nickname: string;
    accessType: AccessType;
    role: RoleEnum;

    private constructor() { }

    static from(user: FindUserDto): FindUserResponseDto {
        const dto = new FindUserResponseDto();
        dto.accessType = user.accessType;
        dto.email = user.email;
        dto.id = user.id;
        dto.name = user.name;
        dto.nickname = user.nickname;
        dto.role = user.accessType == AccessType.ADMIN ? RoleEnum.ADMINISTRATOR : RoleEnum.TEACHER;
        return dto;
    }

    static fromUsers(allUsers: FindAllUserDto): FindUserResponseDto[] {
        const users: FindUserResponseDto[] = [];
        if (allUsers.all.length == 0) return users;
        allUsers.all.forEach(it => {
            const user = this.from(it);
            users.push(user);
        })
        return users;
    }
}
