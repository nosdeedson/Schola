import { Parent } from "@/domain/parent/parent";
import { UserConverter } from "../@shared/user-converter/user.converter.interface";
import { ParentEntity } from "./parent.entity";

export class ParentUserConverter implements UserConverter<Parent>{

    converter(entity: Parent): ParentEntity {
        return ParentEntity.toParentEntity(entity);
    }
    
}