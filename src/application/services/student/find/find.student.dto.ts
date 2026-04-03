import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class FindStutendDto{
    createdAt: Date;
    deletedAt: Date;
    enrolled: string;
    id: string;
    name: string;
    parentsIds: string[] = [];
    schoolGroupId: string;

    constructor(student: StudentEntity){
        this.createdAt = student.createdAt;
        this.deletedAt = student.deletedAt;
        this.enrolled = student.enrolled;
        this.id = student.id;
        this.name = student.fullName;
        this.schoolGroupId = student?.schoolGroup?.id;
    }
}