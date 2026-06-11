import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";
import { AccessType } from "@/domain/user/access.type";
import { User } from "@/domain/user/user";
import { ParentUserConverter } from "@/infrastructure/entities/parent/parent.user.converter";
import { StudentUserConverter } from "@/infrastructure/entities/student/student.user.converter";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { WorkerUserconverter } from "@/infrastructure/entities/worker/worker.user.converter";
import { ClassMapper } from "../schoolgroup/class-mapper";
import { Worker } from "@/domain/worker/worker";
import { Person } from "@/domain/@shared/person";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { StudentMapper } from "../student/student-mapper";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { ParentMapper } from "../parent/parent-mapper";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { WorkerMapper } from "../worker/worker-mapper";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { ConflictException } from "@nestjs/common";

export class UserMapper {

    static getPerson(accessType: AccessType, person: PersonEntity): Person {
        switch (accessType) {
            case 'student':
                return StudentMapper.fromEntity(person as StudentEntity);
            case 'parent':
                return ParentMapper.fromEntity(person as ParentEntity);
            case 'teacher':
            case 'admin':
                return WorkerMapper.fromEntity(person as WorkerEntity);
            default:
                throw new ConflictException("Access type invalid");
        }
    }

    static fromEntity(entity: UserEntity): User {
        if(!entity) return null;
        return new User(
            this.getPerson(entity.accessType, entity.person),
            entity.email,
            entity.nickname,
            entity.password,
            entity.accessType,
            entity.id,
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt,
        );
    }

    static fromDomain(user: User): UserEntity {
        let userModel = new UserEntity();
        userModel.createdAt = user.getCreatedAt();
        userModel.deletedAt = user.getDeletedAt();
        userModel.email = user.getEmail();
        userModel.id = user.getId();
        userModel.password = user.getPassword();
        if (user.getAccessType() == AccessType.ADMIN) {
            userModel.person = new WorkerUserconverter().converter(user.getPerson() as Worker);
        } else if (user.getAccessType() == AccessType.PARENT) {
            userModel.person = new ParentUserConverter().converter(user.getPerson() as Parent);
        } else if (user.getAccessType() == AccessType.STUDENT) {
            userModel.person = new StudentUserConverter().converter(user.getPerson() as Student);
        } else if (user.getAccessType() == AccessType.TEACHER) {
            let teacher = user.getPerson() as Worker;
            let schoolGroups = teacher.getClasses();
            let modelOfClass = null;
            if (schoolGroups) {
                modelOfClass = ClassMapper.fromDomain(schoolGroups[0])
            }
            userModel.person = new WorkerUserconverter().converter(teacher, modelOfClass);
        } else {
            throw new Error("access type does not exist");
        }
        userModel.updatedAt = user.getUpdatedAt();
        userModel.accessType = user.getAccessType();
        userModel.nickname = user.getNickname();

        return userModel;
    }

}