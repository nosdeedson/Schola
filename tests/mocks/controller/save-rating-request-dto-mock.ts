import { Grade } from '../../../src/domain/enum/grade/grade';
import { SaveRatingRequestDto } from '../../../src/infrastructure/api/controllers/rating/dto/save-rating-request-dto';

type SaveRatingRequestDtoMock = {
    studentBeingEvaluatedId?: string;
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

export function mockSaveRatingRequest(
    overrides: SaveRatingRequestDtoMock = {}
): SaveRatingRequestDto {
    const dto = new SaveRatingRequestDto();
    dto.comment = overrides.comment ?? "test test";
    dto.grammar = overrides.grammar ?? Grade.BAD;
    dto.homework = overrides.homework ?? Grade.BAD;
    dto.listing = overrides.listing ?? Grade.BAD;
    dto.reading = overrides.reading ?? Grade.BAD;
    dto.speaking = overrides.speaking ?? Grade.BAD;
    dto.studentBeingEvaluatedId = overrides.studentBeingEvaluatedId ?? "1c1a0e96-0348-4561-8b51-591de1962153";
    dto.teacherId = overrides.teacherId ?? "622476be-8567-4f19-a747-f830844d3473";
    dto.vocabulary = overrides.vocabulary ?? Grade.BAD;
    dto.writing = overrides.writing ?? Grade.BAD;
    return dto;
}
