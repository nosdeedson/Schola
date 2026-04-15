import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

export class FindClassDto {

    id: string;
    classCode: string;
    nameBook: string;
    name: string;
    schedule: FindClassScheduleDto;
    teacher: FindClassTeacherDto;
    students: FindClassStudentDto[];

    static toDto(entity: ClassEntity): FindClassDto {
        let dto = new FindClassDto();
        dto.id = entity.id;
        dto.classCode = entity.classCode;
        dto.name = entity.className;
        dto.nameBook = entity.bookName;
        dto.schedule = FindClassScheduleDto.toDto(entity);
        dto.students = FindClassStudentDto.toDto(entity.students);
        dto.teacher = FindClassTeacherDto.toDto(entity.teacher);
        return dto;
    }
}

export class FindClassStudentDto {
    id: string;
    name: string;

    static toDto(entities: StudentEntity[]): FindClassStudentDto[]{
        let dtos : FindClassStudentDto[] = [];
        if(entities){
            entities.forEach(it =>{
                let dto = new FindClassStudentDto();
                dto.id = it.id;
                dto.name = it.fullName;
                dtos.push(dto);
            });
        }
        return dtos;
    }
}

export class FindClassTeacherDto {
    id: string;
    name: string;

    static toDto(teacher: WorkerEntity): FindClassTeacherDto{
        let dto = new FindClassTeacherDto();
        if(teacher){
            dto.id = teacher.id;
            dto.name = teacher.fullName;
        };
        return dto;
    }
}

export class  FindClassScheduleDto {

    dayOfWeeks: string[] = [];
    times: Record<string, string> = {};

    static toDto(entity: ClassEntity): FindClassScheduleDto {
        let dto = new FindClassScheduleDto();
        dto.dayOfWeeks.push(entity.firstDayOfClassInWeek);
        dto.dayOfWeeks.push(entity.secondDayOfClassInWeek);
        let t = new Map();
        t.set(entity.firstDayOfClassInWeek, entity.timeFirstDay);
        t.set(entity.secondDayOfClassInWeek, entity.timeSecondDay);
        dto.times = Object.fromEntries(t);
        return dto;
    }
}