import { Student } from "@/domain/student/student";
import { UserConverter } from "../@shared/user-converter/user.converter.interface";
import { StudentEntity } from "./student.entity";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";

export class StudentUserConverter implements UserConverter<Student> {

    converter(entity: Student): StudentEntity {
        return StudentMapper.fromDomain(entity);
    }

}
