import { Student } from "./student";
import { Validator } from '../@shared/validation/validator.interface'
import * as yup from 'yup'

export class StudentValidator implements Validator<Student>{
    validate(entity: Student): void {
        try {
            yup.object()
            .shape({
                name: yup.string().required('Name should not be null'),
                birthday: yup.date().required('Birthday should not be null'),
                enrolled: yup.string().required('Enrolled should not be null'),
            })
            .validateSync({
                name: entity.getName(),
                birthday: entity.getBirthday(),
                enrolled: entity.getEnrolled(),
            },{
                abortEarly: false
            });
        } catch (error) {
            const err = error as yup.ValidationError;
            err.errors.forEach(element =>{
                entity.notification?.addError({
                    context: 'student',
                    message: element
                })
            })
        }
    }

}