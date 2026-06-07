import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";
import { AcademicSemesterMapper } from "./academic-semester-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

describe('AcademicSemesterMapper', () => {
    it('should convert from domain semester to entity semester', () => {
        expect(AcademicSemesterMapper.fromDomain(mockSemester())).toBeInstanceOf(AcademicSemesterEntity);
    });

    it('should convert from sesmester entity to domain semester', () => {
        const entity = AcademicSemesterMapper.fromDomain(mockSemester());
        expect(AcademicSemesterMapper.fromEntity(entity)).toBeInstanceOf(AcademicSemester);
    });
});
