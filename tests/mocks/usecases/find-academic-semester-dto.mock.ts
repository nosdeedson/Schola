import { FindAcademicSemesterDto } from '../../../src/application/services/academic-semester/find/find.academic-semester.dto';
import { QuarterDto } from '../../../src/application/services/academic-semester/create/quarter/quarter.dto';

type QuarterDtoMock = {
    beginningDate?: Date;
    endingDate?: Date;
    currentQuarter?: boolean;
}

type FindAcademicSemesterDtoMock = {
    id?: string;
    current?: boolean;
    firstQuarter?: QuarterDtoMock;
    secondQuarter?: QuarterDtoMock;
}

export function mockQuarterDto(
    overrides: QuarterDtoMock = {}
): QuarterDto {
    return new QuarterDto({
        beginningDate: overrides.beginningDate ?? new Date(2026, 1, 2, 23, 59, 59),
        endingDate: overrides.endingDate ?? new Date(2026, 3, 30, 23, 59, 59),
        currentQuarter: true
    });
}

export function mockFindAcademicSemesterDto(
    overrides: FindAcademicSemesterDtoMock = {}
): FindAcademicSemesterDto {
    return new FindAcademicSemesterDto({
        id: overrides.id ?? "",
        current: overrides.current ?? true,
        firstQuarter: overrides.firstQuarter ?? mockQuarterDto(overrides.firstQuarter),
        secondQuarter: overrides.secondQuarter ?? mockQuarterDto(overrides.secondQuarter)
    });
}
