import { QuarterDto } from '../../../src/application/services/academic-semester/create/quarter/quarter.dto';

type QuarterDtoMock = {
    currentQuarter?: boolean;
    beginningDate?: Date;
    endingDate?: Date;
}

export function mockQuarterDto(
    overrides: QuarterDtoMock = {}
): QuarterDto {
    return new QuarterDto({
        currentQuarter: false,
        beginningDate: new Date(2026, 0, 1),
        endingDate: new Date(2026, 2, 31),
        ...overrides
    })
}