import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { ParentMapper } from "./parent-mapper";
import { Parent } from "@/domain/parent/parent";


describe('ParentMapper', () => {
    it('should convert parent domain to parent entity', () => {
        expect(ParentMapper.fromDomain(mockParent())).toBeInstanceOf(ParentEntity);
    });

    it('should convert entity parent to parent domain', () => {
        const entity = ParentMapper.fromDomain(mockParent());
        expect(ParentMapper.fromEntity(entity)).toBeInstanceOf(Parent);
    });
});
