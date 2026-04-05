import * as yup from 'yup';
import { Validator } from "../@shared/validation/validator.interface";
import { Class } from "./class";

export class ClassValidator implements Validator<Class> {

    validate(entity: Class): void {
        try {
            yup.object()
                .shape({
                    classCode: yup.string().required('classcode is required'),
                    nameBook: yup.string().required('Name of the book is required'),
                    name: yup.string().required('Name of the class is required'),
                    schedule: yup.object().required('Schedule of the class is required'),
                })
                .validateSync({
                    classCode: entity.getClassCode(),
                    name: entity.getName(),
                    nameBook: entity.getNameBook(),
                    schedule: entity.getSchecule()
                },
                    {
                        abortEarly: false
                    }
                );
            if (!entity.getSchecule()) {
                entity.notification?.addError({ context: 'class', message: 'schedule is required' })
            } else {
                if (entity.getSchecule().notification.hasError()) {
                    let msgs = [];
                    entity.getSchecule().notification.getErrors().forEach(it => {
                        msgs.push(it.message)
                    });
                    entity.notification?.addError({ context: 'class', message: msgs.join(',') })
                }
                if (entity.getSchecule().getDayOfWeek() && entity.getSchecule().getTimes()) {
                    if (
                        entity.getSchecule().getDayOfWeek()[0] === entity.getSchecule().getDayOfWeek()[1]
                        && entity.getSchecule().getTimes()[0] === entity.getSchecule().getTimes()[1]
                    ) {
                        entity.notification?.addError({ context: 'class', message: 'time must be different when day of week are equal' })
                    }
                }
            }
        } catch (error) {
            const err = error as yup.ValidationError
            err.errors.forEach(element => {
                entity.notification?.addError({
                    context: 'class',
                    message: element
                })
            })
        }
    }

}
