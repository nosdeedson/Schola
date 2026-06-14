import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { FindAcademicSemesterDto } from "../find/find.academic-semester.dto";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

export class FindAllAcademicSemesterDto {
    all: FindAcademicSemesterDto[] = [];

    constructor(entities: AcademicSemester[]) {
        entities.map(it => {
            const firstQuarter = it.getFirstQuarter();
            const secondQuarter = it.getSecondQuarter();
            let semester = new FindAcademicSemesterDto({
                id: it.getId(),
                current: it.getCurrentSemester(),
                firstQuarter,
                secondQuarter
            });
            this.all.push(semester)
        })
    }
}
