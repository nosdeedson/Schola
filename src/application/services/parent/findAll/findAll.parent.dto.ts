import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { FindParentDto } from "../find/find.parent.dto";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { Parent } from "@/domain/parent/parent";

export class FindAllParentDto{
    all: FindParentDto[] = [];

    constructor(entities: Parent[]){
        entities.map(it => {
            let dto = FindParentDto.toDto(it);
            this.all.push(dto);
        })
    }
}