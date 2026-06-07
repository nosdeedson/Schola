import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../../../../tests/mocks/domain/class.mocks";
import { ClassMapper } from "./class-mapper";
import { Class } from "@/domain/class/class";

describe('ClassMapper', () => {
    it('should create a class entity', () => {
        expect(ClassMapper.fromDomain(mockClass())).toBeInstanceOf(ClassEntity);
    });

    it('should create a domain class', () => {
        const entity = ClassMapper.fromDomain(mockClass());
        expect(ClassMapper.fromEntity(entity)).toBeInstanceOf(Class);
    });
});
