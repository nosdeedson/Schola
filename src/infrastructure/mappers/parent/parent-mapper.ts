import { Parent } from "@/domain/parent/parent";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";

export class ParentMapper {

    static fromEntity(entity: ParentEntity): Parent {
        if(!entity) return null;
        return new Parent({
            name: entity.fullName,
            birthday: entity.birthday,
            createdAt: entity?.createdAt,
            updatedAt: entity?.updatedAt,
            deletedAt: entity?.deletedAt,
            id: entity?.id
        })
    }

    static fromDomain(parent: Parent): ParentEntity {
        let entity = new ParentEntity();
        entity.birthday = parent.getBirthday();
        entity.createdAt = parent.getCreatedAt();
        entity.deletedAt = parent.getDeletedAt();
        entity.fullName = parent.getName();
        entity.id = parent.getId();
        entity.updatedAt = parent.getUpdatedAt();
        return entity;
    }

    static toParentsModels(parents: Parent[]): ParentEntity[] {
        let models = parents.map(it => this.fromDomain(it));
        return models;
    }

}
