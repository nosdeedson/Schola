import { FindUserDto } from "../find/find.user.dto";
import { User } from "@/domain/user/user";

export class FindAllUserDto {
    all: FindUserDto[] = [];

    constructor(entities: User[]) {
        entities.map(it => {
            let user = new FindUserDto(
                it.getId(),
                it.getPerson().getId(),
                it.getEmail(),
                it.getNickname(),
                it.getPerson().getName(),
                it.getAccessType()
            );
            this.all.push(user);
        })
    }
}
