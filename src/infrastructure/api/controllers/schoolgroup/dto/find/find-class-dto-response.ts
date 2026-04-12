import { ClassScheduleDto, ClassStudentDto, ClassTeacherDto } from "@/application/services/class/find/find.class.dto";

export class FindClassDtoResponseDto {
    id: string;
    classCode: string;
    nameBook: string;
    name: string;
    // TODO CREATE THE RESPONSE DTO
    schedule: ClassScheduleDto;
    teacher: ClassTeacherDto;
    students: ClassStudentDto[];
}
