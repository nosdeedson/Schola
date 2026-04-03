import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";

export class FindParentDto {

    id:string;
    name: string;
    createdAt : Date;

    static toDto(entity: ParentEntity): FindParentDto{
        let dto = new FindParentDto();
        dto.id = entity.id;
        dto.name = entity.fullName;
        dto.createdAt = entity.createdAt;
        return dto;
    }

}