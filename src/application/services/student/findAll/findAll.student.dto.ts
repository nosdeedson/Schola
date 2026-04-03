import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { FindStutendDto } from "../find/find.student.dto";

export class FindAllStudentDto{
    all: FindStutendDto[] = [];

    constructor(entities: StudentEntity[]){
        entities.map(it =>{
            this.all.push(new FindStutendDto(it));
        })
    }
}