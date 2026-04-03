import { ScheduleDto } from "@/application/services/class/create/schedule-dto";

export class CreateSchoolgroupScheduleUsecaseDto {
    dayOfWeeks: string[];
    times: string[];
    constructor(params: {
        dayOfWeeks: string[],
        times: string[],
    }) {
        this.dayOfWeeks = params.dayOfWeeks;
        this.times = params.times;
    }

    toMap(times: string[], dayOfWeeks: string[]){
        let m = new Map<string, string>();
        m.set(dayOfWeeks[0], times[0]);
        m.set(dayOfWeeks[1], times[1]);
        return m;
    }

    toScheduleDto(): ScheduleDto {
        return new ScheduleDto(this.dayOfWeeks, this.toMap(this.times, this.dayOfWeeks));
    }
}