import { Quarter } from "@/domain/quarter/quarter";
import { mockQuarter } from "./quarter.mocks";
import { mockStudent } from "./student.mocks";
import { Student } from "@/domain/student/student";
import { Grade } from "@/domain/enum/grade/grade";
import { Rating } from "@/domain/rating/rating";

type RatingMock = {
    comments?: Comment[];
    quarter?: Quarter;
    student?: Student;
    ratingDate?: Date;
    listing?: Grade;
    writing?: Grade;
    reading?: Grade;
    speaking?: Grade;
    grammar?: Grade;
    homework?: Grade;
    vocabulary?: Grade;
}

export function mockRating(
    overrides: RatingMock = {}
): Rating {
    return new Rating(
        overrides.quarter || mockQuarter(),
        overrides.student || mockStudent(),
        overrides.ratingDate || new Date(),
        overrides.listing || Grade.BAD,
        overrides.writing || Grade.BAD,
        overrides.reading || Grade.BAD,
        overrides.speaking || Grade.BAD,
        overrides.grammar || Grade.BAD,
        overrides.homework || Grade.BAD,
        overrides.vocabulary || Grade.BAD,
    );
}
