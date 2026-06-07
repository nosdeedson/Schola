import { Schedule } from "@/domain/schedule/schedule";
import { mockClass } from "../../../../tests/mocks/domain/class.mocks"
import { ClassMapper } from "../schoolgroup/class-mapper"
import { ScheduleMapper } from "./schedule-mapper";


describe('ScheduleMapper', () => {
    it('should return a domain Schedule', () => {
        const entity = ClassMapper.fromDomain(mockClass());
        expect(ScheduleMapper.fromEntity(entity)).toBeInstanceOf(Schedule);
    })
})
