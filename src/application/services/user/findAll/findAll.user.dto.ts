import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { FindUserDto } from "../find/find.user.dto";

export class FindAllUserDto {
    all: FindUserDto[] = [];

    constructor(entities: UserEntity[]){
        entities.map(it => {
            let user = new FindUserDto(it.id, it.person.id, it.email, it.nickname, it.accesType);
            this.all.push(user);
        })
    }
}