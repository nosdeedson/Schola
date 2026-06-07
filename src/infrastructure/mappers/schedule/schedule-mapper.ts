import { Schedule } from "@/domain/schedule/schedule";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { map } from "rxjs";


export class ScheduleMapper {

    static fromEntity(entity: ClassEntity): Schedule {
        const times = new Map();
        times.set(entity.firstDayOfClassInWeek, entity.timeFirstDay);
        times.set(entity.secondDayOfClassInWeek, entity.timeSecondDay);
        return new Schedule(
            [entity.firstDayOfClassInWeek, entity.secondDayOfClassInWeek],
            times
        )
    }
}
