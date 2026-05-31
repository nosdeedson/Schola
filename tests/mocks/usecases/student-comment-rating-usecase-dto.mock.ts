import { StudentCommentRatingUsecaseDto } from "@/application/usecases/comment-rating/comment-rating-usecase-dto";

type StudentCommentRatingUsecaseDtoMock = {
    comment?: string;
    namePersonHaveDone?: string;
    ratingId?: string;
}

export function mockStudentRatingUsecaseDto(
    overrides: StudentCommentRatingUsecaseDtoMock = {}
): StudentCommentRatingUsecaseDto {
    return new StudentCommentRatingUsecaseDto(
        overrides.comment ?? "any commnet",
        overrides.namePersonHaveDone ?? "any name",
        overrides.ratingId ?? "2e3066eb-8cc0-49f6-96a4-adb1c41e3960"
    );
}
