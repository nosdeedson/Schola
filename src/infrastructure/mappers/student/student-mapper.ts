import { Student } from "@/domain/student/student";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { ClassMapper } from "../schoolgroup/class-mapper";

export class StudentMapper {


    static fromEntity(entity: StudentEntity): Student {
        if (!entity) return null;
        const domain = new Student({
            nameParents: [],
            birthday: entity.birthday,
            name: entity.fullName,
            enrolled: entity.enrolled,
            id: entity.id,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt
        });
        const schoogroup = entity.schoolGroup ? ClassMapper.fromEntity(entity.schoolGroup) : null;
        domain.setSchoolGroup(schoogroup);
        return domain;
    }

    static fromDomain(student: Student): StudentEntity {
        let model = new StudentEntity();
        model.birthday = student.getBirthday();
        model.createdAt = student.getCreatedAt();
        model.deletedAt = student.getDeletedAt();
        model.updatedAt = student.getUpdatedAt();
        model.enrolled = student.getEnrolled();
        model.fullName = student.getName();
        model.id = student.getId();
        model.schoolGroup = ClassMapper.fromDomain(student.getSchoolGroup());
        return model;
    }

    static toStudentsEntities(students: Student[]): StudentEntity[] {
        let models: StudentEntity[] = [];
        students.forEach(it => {
            let s = this.fromDomain(it);
            models.push(s);
        })
        return models;
    }
}
