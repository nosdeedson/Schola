import { AccessType } from "../../../domain/user/access.type";
import { User } from "../../../domain/user/user";
import { UserEntity } from "./user.entity";
import { mockPerson } from '../../../../tests/mocks/domain/mock.person';
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";

describe('UserEntity Unit tests', () =>{

    let user: User;

    it('should instantiate an user with access type equal to admin', () => {
        user = mockPerson(AccessType.ADMIN);
        let userModel = UserMapper.fromDomain(user);
        expect(userModel).toBeDefined();
        expect(userModel.id).toEqual(user.getId());
        expect(userModel.accessType).toEqual(user.getAccessType());
        expect(userModel.createdAt).toEqual(user.getCreatedAt());
        expect(userModel.deletedAt).toEqual(user.getDeletedAt());
        expect(userModel.email).toEqual(user.getEmail());
        expect(userModel.password).toEqual(user.getPassword());
        expect(userModel.person.id).toEqual(user.getPerson().getId());
        expect(userModel.updatedAt).toEqual(user.getUpdatedAt());
    });

    it('should instantiate an user with access type equal to parent', () => {
        user = mockPerson(AccessType.PARENT);
        let userModel = UserMapper.fromDomain(user);
        expect(userModel).toBeDefined();
        expect(userModel.id).toEqual(user.getId());
        expect(userModel.accessType).toEqual(user.getAccessType());
        expect(userModel.createdAt).toEqual(user.getCreatedAt());
        expect(userModel.deletedAt).toEqual(user.getDeletedAt());
        expect(userModel.email).toEqual(user.getEmail());
        expect(userModel.password).toEqual(user.getPassword());
        expect(userModel.person.id).toEqual(user.getPerson().getId());
        expect(userModel.updatedAt).toEqual(user.getUpdatedAt());
    });

    it('should instantiate an user with access type equal to student', () => {
        user = mockPerson(AccessType.STUDENT);
        let userModel = UserMapper.fromDomain(user);
        expect(userModel).toBeDefined();
        expect(userModel.id).toEqual(user.getId());
        expect(userModel.accessType).toEqual(user.getAccessType());
        expect(userModel.createdAt).toEqual(user.getCreatedAt());
        expect(userModel.deletedAt).toEqual(user.getDeletedAt());
        expect(userModel.email).toEqual(user.getEmail());
        expect(userModel.password).toEqual(user.getPassword());
        expect(userModel.person.id).toEqual(user.getPerson().getId());
        expect(userModel.updatedAt).toEqual(user.getUpdatedAt());
    });

    it('should instantiate an user with access type equal to teacher', () => {
        user = mockPerson(AccessType.TEACHER);
        let userModel = UserMapper.fromDomain(user);
        expect(userModel).toBeDefined();
        expect(userModel.id).toEqual(user.getId());
        expect(userModel.accessType).toEqual(user.getAccessType());
        expect(userModel.createdAt).toEqual(user.getCreatedAt());
        expect(userModel.deletedAt).toEqual(user.getDeletedAt());
        expect(userModel.email).toEqual(user.getEmail());
        expect(userModel.password).toEqual(user.getPassword());
        expect(userModel.person.id).toEqual(user.getPerson().getId());
        expect(userModel.updatedAt).toEqual(user.getUpdatedAt());
    });

    it('should throw an error while trying to create an useEntity', async () => {
        user = mockPerson("NOT_VALID" as any);
        expect( () => { UserMapper.fromDomain(user);})
            .toThrow("access type does not exist");
    });
});