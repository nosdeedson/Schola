import { Parent } from "@/domain/parent/parent";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";

export class FindParentDto {

    id:string;
    name: string;
    createdAt : Date;

    static toDto(entity: Parent): FindParentDto{
        let dto = new FindParentDto();
        dto.id = entity.getId();
        dto.name = entity.getName();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }

}