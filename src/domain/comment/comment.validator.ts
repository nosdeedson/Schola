import { Validator } from '../@shared/validation/validator.interface'
import * as yup from 'yup'
import { Comment } from './comment';

export class CommentValidator implements Validator<Comment> {

    validate(entity: Comment): void {
        try {
            yup.object()
                .shape({
                    comment: yup.string().required('add a comment'),
                    namePersonHaveDone: yup.string().required('name of person has done is requered'),
                })
                .validateSync({
                    comment: entity.getComment(),
                    namePersonHaveDone: entity.getNamePersonHaveDone(),
                }, {
                    abortEarly: false
                })
        } catch (error) {
            const err = error as yup.ValidationError;
            err.errors.forEach(it => {
                entity.notification?.addError({
                    context: 'comment',
                    message: it
                })
            })
        }
    }

}
