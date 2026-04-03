import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";

export class CreateParentDto {
    birthday: Date;
    name: string;
    students: string[]

    constructor(
        birthday: Date,
        name: string,
        students: string[]
    ) {
        this.birthday = birthday;
        this.name = name;
        this.students = students;
    }

    static toParent(dto: CreateParentDto): Parent {
        // TODO FIX HERE students must be found be name
        let parent = new Parent( {name: dto.name, nameStudents: dto.students, birthday: dto.birthday});
        return parent;
    }
}
