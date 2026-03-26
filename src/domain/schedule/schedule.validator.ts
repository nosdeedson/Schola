import { Validator } from "../@shared/validation/validator.interface";
import { Schedule } from "./schedule";
import * as yup from 'yup';
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ScheduleValidator implements Validator<Schedule> {

    validate(entity: Schedule): void {

        try {
            yup.object()
                .shape({
                    dayOfWeek: yup.array()
                        .required("days of week must be defined")
                        .length(2, 'must inform two days for the lessons'),
                    times: yup.mixed()
                        .required('times must be defined')
                        .test("is-map", "times must be a map", value => value instanceof Map)
                        .test(
                            "is-map", 
                            "times must be defined", 
                            value => value instanceof Map && value.size == 2)
                })
                .validateSync({
                    dayOfWeek: entity.getDayOfWeek(),
                    times: entity.getTimes()
                },
                    {
                        abortEarly: false
                    }
                );
            if (Array.isArray(entity.getDayOfWeek()) ) {
                if (
                    entity.getDayOfWeek()[0] === 'Sunday' 
                    || entity.getDayOfWeek()[1] === 'Sunday' 
                    || entity.getDayOfWeek()[0] === 'Saturday'
                    || entity.getDayOfWeek()[1] === 'Saturday'
                ) {
                    entity.notification?.addError({ context: 'class', message: 'schedule must be a weekday' })
                }
            }
        } catch (error) {
            const err = error as yup.ValidationError;
            err.errors.forEach(it => {
                entity.notification?.addError({
                    context: 'schedule',
                    message: it
                })
            });
        }
    }

}