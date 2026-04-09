import { Grade } from "@/domain/enum/grade/grade";

export class SaveRatingUsecaseDto {
    studentId: string;
    listing: Grade;
    writing: Grade;
    reading: Grade;
    speaking: Grade;
    grammar: Grade;
    homework: Grade;
    vocabulary: Grade;
}