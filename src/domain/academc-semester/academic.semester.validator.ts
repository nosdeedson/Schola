import { Validator } from '../@shared/validation/validator.interface'
import { AcademicSemester } from './academic.semester';
import * as yup from 'yup'
import { isAfter, isBefore, isWeekend, isEqual } from 'date-fns';

export class AcademicSemesterValidator implements Validator<AcademicSemester>{

    validate(entity: AcademicSemester): void {
        try {
            yup.object()
                .shape({
                    actual : yup.boolean().required('must inform academicSemester is the current or not'),
                    firstQuarter : yup.object().required('First Quarter is required'),
                    secondQuarter : yup.object().required('Second Quarter is required')
                })
                .validateSync({
                    actual : entity.getCurrentSemester(),
                    firstQuarter : entity.getFirstQuarter(),
                    secondQuarter: entity.getSecondQuarter()
                },{
                    abortEarly: false
                })
                if(isAfter(entity.firstQuarter.endingDate, entity.secondQuarter.beginningDate)){
                    entity.notification?.addError({
                        context: "academicSemester",
                        message: "the end of the first Quarter must be before the start of the beggining of the secondQuarter"
                    })
                }
                
        } catch (error) {
            let err = error as yup.ValidationError;
            err.errors.forEach(it => {
                entity.notification?.addError({
                    context: 'academicSemester',
                    message: it
                })
            })
        }
    }

}