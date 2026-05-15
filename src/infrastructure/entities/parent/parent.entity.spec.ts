import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { ParentEntity } from "./parent.entity";

describe('ParentEntity', () => {

    it('should intantiate a ParentModel', () => {
        const parent = mockParent();
        let model = ParentEntity.toParentEntity(parent);
        expect(model).toBeDefined();
        expect(model.birthday).toBe(parent.getBirthday());
        expect(model.createdAt).toBe(parent.getCreatedAt());
        expect(model.deletedAt).toBe(parent.getDeletedAt());
        expect(model.fullName).toBe(parent.getName());
        expect(model.id).toBe(parent.getId());
        expect(model.updatedAt).toBe(parent.getUpdatedAt());
    });

    it('should instantiate a ParentModel', () => {
        const parent = mockParent();
        let models = ParentEntity.toParentsModels([parent]);
        expect(models).toBeDefined();
        expect(models[0].birthday).toBe(parent.getBirthday());
        expect(models[0].createdAt).toBe(parent.getCreatedAt());
        expect(models[0].deletedAt).toBe(parent.getDeletedAt());
        expect(models[0].fullName).toBe(parent.getName());
        expect(models[0].id).toBe(parent.getId());
        expect(models[0].updatedAt).toBe(parent.getUpdatedAt());
    });

});