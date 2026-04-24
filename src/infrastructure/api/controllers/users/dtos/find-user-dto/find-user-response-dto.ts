import { FindUserDto } from "@/application/services/user/find/find.user.dto";
import { AccessType } from "@/domain/user/access.type";
import { RoleEnum } from "@/domain/worker/roleEnum";

export class FindUserResponseDto {
    id: string;
    email: string;
    name: string;
    nickname: string;
    accessType: AccessType;
    role: RoleEnum;

    static fromFindUserDto(user: FindUserDto) {
        const dto = new FindUserResponseDto();
        dto.accessType = user.accessType;
        dto.email = user.email;
        dto.id = user.id;
        dto.name = user.name;
        dto.nickname = user.nickname;
        dto.role = user.accessType == AccessType.ADMIN ? RoleEnum.ADMINISTRATOR : RoleEnum.TEACHER;
        return dto;
    }
}
