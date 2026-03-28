import { Schedule } from "../../../src/domain/schedule/schedule";

type ScheduleMock = {
    daysOfWeek?: string[];
    times?: Map<string, string>;
}

export function mockSchedule (
    overrides: ScheduleMock = {}
) : Schedule {
    return new Schedule(
        overrides.daysOfWeek || [],
        overrides.times || new Map([['Monday', "08:00"], ['tuesday', "08:00"]])
    )
}