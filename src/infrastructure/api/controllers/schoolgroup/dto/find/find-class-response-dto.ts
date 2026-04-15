import { FindClassScheduleDto, FindClassStudentDto, FindClassTeacherDto } from "@/application/services/class/find/find.class.dto";

export class FindClassResponseDto {
    id: string;
    classCode: string;
    nameBook: string;
    name: string;
    schedule: FindClassScheduleDto;
    teacher: FindClassTeacherDto;
    students: FindClassStudentDto[];

    constructor(params: {
        id: string,
        classCode: string,
        nameBook: string,
        name: string,
        schedule: FindClassScheduleDto,
        teacher: FindClassTeacherDto,
        students: FindClassStudentDto[],
    }) {
        this.id = params.id;
        this.classCode = params.classCode;
        this.nameBook = params.nameBook;
        this.name = params.name;
        this.schedule = new FindClassScheduleResponseDto({
            dayOfWeeks: params.schedule.dayOfWeeks, times: params.schedule.times
        });
        this.teacher = new FindClassTeacherResponseDto(
            {id: params.teacher.id, name: params.teacher.name}
        );
        params.students.forEach(it => {
            const studentResponse = new FindClassStudentResponseDto({
                id: it.id, name: it.name
            })
        });
    }
}

export class FindClassScheduleResponseDto {
    dayOfWeeks: string[] = [];
    times: Record<string, string> = {};
    constructor(params: {
        dayOfWeeks: string[], times: Record<string, string>
    }) {
        this.dayOfWeeks = params.dayOfWeeks;
        this.times = params.times;
    }
}

export class FindClassTeacherResponseDto {
    id: string;
    name: string;
    constructor(params: {
        id: string,
        name: string
    }) {
        this.id = params.id;
        this.name = params.name;
    }
}

export class FindClassStudentResponseDto {
    id: string;
    name: string;
    constructor(params: {
        id: string,
        name: string
    }) {
        this.id = params.id;
        this.name = params.name;
    }
}
