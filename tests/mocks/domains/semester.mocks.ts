import { Quarter } from "../../../src/domain/quarter/quarter";
import { AcademicSemester } from "../../../src/domain/academc-semester/academic.semester";
import { mockQuarter } from "./quarter.mocks";

type SemesterMock = {
    firstQuarter?: Quarter;
    secondQuarter?: Quarter;
    currentSemester?: boolean;
}

export function mockSemester(
  overrides: SemesterMock = {}
): AcademicSemester {
    return new AcademicSemester(
        overrides.firstQuarter ?? mockQuarter(),
        overrides.secondQuarter ?? mockQuarter(),
        overrides.currentSemester ?? true
    )
}