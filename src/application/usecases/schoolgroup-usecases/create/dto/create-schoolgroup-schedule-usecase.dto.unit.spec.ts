import { ScheduleDto } from "@/application/services/class/create/schedule-dto";
import { mockCreateSchoolgroupScheduleUsecaseDto } from "../../../../../../tests/mocks/usecases/create-schoolgroup-schedule-usecase-dto.mocks";
import { CreateSchoolgroupScheduleUsecaseDto } from "./create-schoolgroup-schedule-usecase.dto";

describe('CreateSchoolgroupScheduleUsecaseDto', () => {

    it('testing toMap with null values', () => {
        const dto = mockCreateSchoolgroupScheduleUsecaseDto();
        expect(dto.toMap(null, null)).toBeDefined();
    });

    it('testing toMap with values', () => {
        const dto = mockCreateSchoolgroupScheduleUsecaseDto();
        expect(dto.toMap(['08:00', '09:00'], ['monday', 'wednesday'])).toBeDefined();
    });

    it('testing toMap with values', () => {
        const dto = new CreateSchoolgroupScheduleUsecaseDto({ dayOfWeeks: ['wednesday', 'thursday'], times: ['08:00', '09:00'] })
        expect(dto.toScheduleDto()).toBeInstanceOf(ScheduleDto);
    });
});
