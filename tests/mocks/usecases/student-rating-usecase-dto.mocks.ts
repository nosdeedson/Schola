import { Grade } from '../../../src/domain/enum/grade/grade';
import { StudentRatingUsecaseDtoOut } from '../../../src/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { RatingEntity } from '../../../src/infrastructure/entities/rating/rating.entity';

export function mockStudentRatingUsecaseDtoOut(
    overrides: RatingEntity
): StudentRatingUsecaseDtoOut {
    return {
        id: overrides.id ?? "22ac66ab-fae4-4666-82b9-cf0c774f54ed",
        ratingDate: overrides.ratingDate ?? new Date(),
        listing: Grade.EXCELENT,
        writing: Grade.EXCELENT,
        reading: Grade.EXCELENT,
        speaking: Grade.EXCELENT,
        grammar: Grade.EXCELENT,
        homework: Grade.EXCELENT,
        vocabulary: Grade.EXCELENT,
        studentId: overrides.student.id ?? 'f33b56e7-3e23-487d-85c0-1d4b6dad3e34',
        studentName: overrides.student.fullName ?? 'student name',
        ratingId: overrides.quarter.id ?? '4474e59a-9ffc-4de7-94f9-cc8ea2b5cd80',
        comments: ['test']
    }
}
