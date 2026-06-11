import { AccessType } from "@/domain/user/access.type";
import { mockUser } from "../../../../tests/mocks/domain/user.mock";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { UserMapper } from "./user-mapper";
import { User } from "@/domain/user/user";
import { Worker } from "@/domain/worker/worker";
import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";

describe('UserMapper', () => {

    it('should convert from user domain to user entity as admin', () => {
        expect(UserMapper.fromDomain(mockUser(AccessType.ADMIN))).toBeInstanceOf(UserEntity);
    });

    it('should convert from user entity to user domain as admin', () => {
        const entity = UserMapper.fromDomain(mockUser(AccessType.ADMIN));
        expect(UserMapper.fromEntity(entity)).toBeInstanceOf(User);
    });

    it('should convert from user domain to user entity as teacher', () => {
        expect(UserMapper.fromDomain(mockUser(AccessType.TEACHER))).toBeInstanceOf(UserEntity);
    });

    it('should convert from user entity to user domain as teacher', () => {
        const entity = UserMapper.fromDomain(mockUser(AccessType.TEACHER));
        expect(UserMapper.fromEntity(entity)).toBeInstanceOf(User);
    });

    it('should convert from user domain to user entity as parent', () => {
        expect(UserMapper.fromDomain(mockUser(AccessType.PARENT))).toBeInstanceOf(UserEntity);
    });

    it('should convert from user entity to user domain as parent', () => {
        const entity = UserMapper.fromDomain(mockUser(AccessType.PARENT));
        expect(UserMapper.fromEntity(entity)).toBeInstanceOf(User);
    });

    it('should convert from user domain to user entity as student', () => {
        expect(UserMapper.fromDomain(mockUser(AccessType.STUDENT))).toBeInstanceOf(UserEntity);
    });

    it('should convert from user entity to user domain as student', () => {
        const entity = UserMapper.fromDomain(mockUser(AccessType.STUDENT));
        expect(UserMapper.fromEntity(entity)).toBeInstanceOf(User);
    });

    it('should get a worker domain as admin', () => {
        const workerEntity = UserMapper.fromDomain(mockUser(AccessType.ADMIN));
        const worker = UserMapper.getPerson(workerEntity.accessType, workerEntity.person);
        expect(worker).toBeInstanceOf(Worker);
    });

    it('should get a worker domain as teacher', () => {
        const workerEntity = UserMapper.fromDomain(mockUser(AccessType.TEACHER));
        const worker = UserMapper.getPerson(workerEntity.accessType, workerEntity.person);
        expect(worker).toBeInstanceOf(Worker);
    });

    it('should get a parent domain', () => {
        const parentEntity = UserMapper.fromDomain(mockUser(AccessType.PARENT));
        const parent = UserMapper.getPerson(parentEntity.accessType, parentEntity.person);
        expect(parent).toBeInstanceOf(Parent);
    });

    it('should get a student domain', () => {
        const studentEntity = UserMapper.fromDomain(mockUser(AccessType.STUDENT));
        const student = UserMapper.getPerson(studentEntity.accessType, studentEntity.person);
        expect(student).toBeInstanceOf(Student);
    });
});