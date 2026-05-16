import { mockSchedule } from "./schedule.mocks";
import { Schedule } from "../../../src/domain/schedule/schedule";
import { Class } from "../../../src/domain/class/class";


type ClassMock = {
    classCode?: string;
    nameBook?: string;
    name?: string;
    schedule?: Schedule;
}

export const mockClass = (
    overrides: ClassMock = {}
): Class => {

    return new Class(
        overrides.classCode || "12345678",
        overrides.nameBook || "any_name_book",
        overrides.name || "any_name",
        overrides.schedule || mockSchedule(),
    )
}
