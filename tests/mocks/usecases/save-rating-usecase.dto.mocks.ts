import { Grade } from "../../../src/domain/enum/grade/grade";
import { SaveRatingUsecaseDto } from "../../../src/application/usecases/save-rating/save-rating-usecase-dto";

type SaveRatingUsecaseDtoMock = {
    studentId?: string;
    teacherId?: string;
    listing?: Grade;
    writing?: Grade;
    reading?: Grade;
    speaking?: Grade;
    grammar?: Grade;
    homework?: Grade;
    vocabulary?: Grade;
    comment?: string;
}

export function saveRatingUsecaseDtoMock(
    overrides: SaveRatingUsecaseDtoMock = {}
): SaveRatingUsecaseDto {
    const dto = new SaveRatingUsecaseDto();
    dto.grammar = overrides.grammar ?? Grade.BAD;
    dto.homework = overrides.homework ?? Grade.BAD;
    dto.listing = overrides.listing ?? Grade.BAD;
    dto.reading = overrides.reading ?? Grade.BAD;
    dto.speaking = overrides.speaking ?? Grade.BAD;
    dto.vocabulary = overrides.vocabulary ?? Grade.BAD;
    dto.writing = overrides.writing ?? Grade.BAD;
    dto.studentId = overrides.studentId ?? "4deed61c-6a0d-4e51-8204-f0aa1b0bbcc3";
    dto.comment = overrides.comment ?? "test";
    dto.teacherId = overrides.teacherId ?? "a1cfef8d-034e-4022-a76d-86e7db52c79e"
    return dto;
}
