import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { FindStutendDto } from "../find/find.student.dto";
import { Student } from "@/domain/student/student";

export class FindAllStudentDto {
    all: FindStutendDto[] = [];

    constructor(entities: Student[]) {
        entities.map(it => {
            this.all.push(new FindStutendDto(it));
        })
    }
}
