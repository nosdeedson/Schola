import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { QuarterMapper } from "./quarter-mapper";

export class AcademicSemesterMapper {

    static fromDomain(semester: AcademicSemester): AcademicSemesterEntity {
        const entity = new AcademicSemesterEntity();
        entity.quarters = [];
        entity.id = semester.getId();
        entity.quarters.push(QuarterMapper.fromDomain(semester.firstQuarter, 1));
        entity.quarters.push(QuarterMapper.fromDomain(semester.secondQuarter, 2));
        entity.current = semester.currentSemester;
        entity.createdAt = semester.getCreatedAt();
        entity.updatedAt = semester.getUpdatedAt();
        entity.deletedAt = semester.getDeletedAt();
        return entity;
    }

    static fromEntity(entity: AcademicSemesterEntity): AcademicSemester {
        if(!entity) return null;
        return new AcademicSemester(
            entity.quarters[0].quarterNumber == 1 ? QuarterMapper.fromEntity(entity.quarters[0]) : QuarterMapper.fromEntity(entity.quarters[1]),
            entity.quarters[0].quarterNumber == 2 ? QuarterMapper.fromEntity(entity.quarters[0]) : QuarterMapper.fromEntity(entity.quarters[1]),
            entity.current,
            entity.id,
            entity?.createdAt,
            entity?.updatedAt,
            entity?.deletedAt,
        );
    }
}
