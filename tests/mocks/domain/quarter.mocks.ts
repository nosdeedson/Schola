import { Quarter } from '@/domain/quarter/quarter';


type QuarterMock = {
  currentQuarter?: boolean;
  beginningDate?: Date;
  endingDate?: Date;
};

export function mockQuarter(
  overrides: QuarterMock = {}
): Quarter {
  return new Quarter({
    currentQuarter: false,
    beginningDate: new Date(2026, 0, 1),
    endingDate: new Date(2026, 2, 31),
    ...overrides
  });
}
