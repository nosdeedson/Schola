import { Grade } from '../../../src/domain/enum/grade/grade';
import { StudentRatingUsecaseResponseDto } from '../../../src/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { RatingEntity } from '../../../src/infrastructure/entities/rating/rating.entity';
import { QuarterResponseDto } from '@/infrastructure/api/controllers/semester/dto/find/quarter-response-dto';

export function mockStudentRatingUsecaseDtoOut(
    overrides: RatingEntity
): StudentRatingUsecaseResponseDto {
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
        quarter: overrides.quarter ? QuarterResponseDto.fromQuarterEntity(overrides.quarter) : null,
        comments: ['test']
    }
}
