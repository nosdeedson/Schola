import { Student } from "@/domain/student/student";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class FindStutendDto {
    createdAt: Date;
    deletedAt: Date;
    enrolled: string;
    id: string;
    name: string;
    parentsIds: string[] = [];
    schoolGroupId: string;

    constructor(student: Student) {
        this.createdAt = student.getCreatedAt();
        this.deletedAt = student.getDeletedAt();
        this.enrolled = student.getEnrolled();
        this.id = student.getId();
        this.name = student.getName();
        this.schoolGroupId = student?.getSchoolGroup()?.getId();
    }
}
