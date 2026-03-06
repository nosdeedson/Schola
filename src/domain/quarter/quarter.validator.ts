import { Validator } from "../@shared/validation/validator.interface";
import { Quarter } from "./quarter";
import * as yup from 'yup';
import { isAfter, isWeekend, isEqual } from 'date-fns';

export class QuarterValidator implements Validator<Quarter> {
   
    validate(entity: Quarter): void {
        try {
            yup.object()
                .shape({
                    currentQuarter: yup.boolean(),
                    beginningDate : yup.date().required('quarter date beginning must be informed'),
                    endingDate : yup.date().required('quarter date ending must be informed')
                })
                .validateSync({
                    currentQuarter: entity.currentQuarter,
                    beginningDate: entity.beginningDate,
                    endingDate: entity.endingDate,
                },{
                    abortEarly: false
                })
                if(isWeekend(entity.beginningDate) || isWeekend(entity.endingDate) ){
                    entity.notification?.addError({
                        context: 'quarter',
                        message: 'the quarter must start and end in a weekday'
                    })
                }
                if(isAfter(entity.beginningDate, entity.endingDate) || isEqual(entity.beginningDate, entity.endingDate)){
                    entity.notification?.addError({
                        context: 'quarter',
                        message: 'the beggining of the quarter must before the end'
                    })
                }
               
        } catch (error) {
            let err = error as yup.ValidationError;
            err.errors.forEach(it => {
                entity.notification.addError({
                    context: 'quarter',
                    message: it
                })
            })
        }
    }

}