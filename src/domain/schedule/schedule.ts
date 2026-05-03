import { Entity } from "../@shared/entity";
import { ScheduleValidator } from "./schedule.validator";

export class Schedule extends Entity {

    private dayOfWeeks: string[];

    private times: Map<string, string>;

    constructor(
        dayOfWeeks: string[],
        times: Map<string, string>
    ) {
        super();
        this.dayOfWeeks = dayOfWeeks;
        this.times = times;
        this.validate();
    }

    validate() {
        new ScheduleValidator().validate(this);
    }

    getDayOfWeek(): string[] {
        return this.dayOfWeeks;
    }

    getTimes(): Map<string, string> {
        return this.times;
    }

    getTime(key: string) {
        return this.times.get(key);
    }

    static from(params: {
        dayOfWeeks: string[],
        times: Map<string, string>
    }): Schedule {
        const schedule = new Schedule(params.dayOfWeeks, params.times);
        return schedule;
    }

}
