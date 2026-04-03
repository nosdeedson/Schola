import { Student } from "@/domain/student/student";
import { UserConverter } from "../@shared/user-converter/user.converter.interface";
import { StudentEntity } from "./student.entity";

export class StudentUserConverter implements UserConverter<Student> {

    converter(entity: Student): StudentEntity {
        return StudentEntity.toStudentEntity(entity);
    }

}