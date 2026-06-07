import { Parent } from "@/domain/parent/parent";
import { UserConverter } from "../@shared/user-converter/user.converter.interface";
import { ParentEntity } from "./parent.entity";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";

export class ParentUserConverter implements UserConverter<Parent> {

    converter(entity: Parent): ParentEntity {
        return ParentMapper.fromDomain(entity);
    }

}
