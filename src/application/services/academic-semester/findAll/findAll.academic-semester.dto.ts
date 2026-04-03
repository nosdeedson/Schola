import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { FindAcademicSemesterDto } from "../find/find.academic-semester.dto";

export class FindAllAcademicSemesterDto {
    all: FindAcademicSemesterDto[] = [];
    
    constructor(entities: AcademicSemesterEntity[]){
        entities.map(it => {
            const firstQuarter = it.quarters[0].quarterNumber === 1 ? it.quarters[0] : it.quarters[1];
            const secondQuarter = it.quarters[0].quarterNumber === 2 ? it.quarters[0] : it.quarters[1];
            let semester = new FindAcademicSemesterDto({id: it.id, current: it.current, firstQuarter, secondQuarter});
            this.all.push(semester)
        })
    }
}