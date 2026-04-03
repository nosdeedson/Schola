import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

export class FindClassDto {

    id: string;
    classCode: string;
    nameBook: string;
    name: string;
    schedule: ClassScheduleDto;
    teacher: ClassTeacherDto;
    students: ClassStudentDto[];

    static toDto(entity: ClassEntity): FindClassDto {
        let dto = new FindClassDto();
        dto.id = entity.id;
        dto.classCode = entity.classCode;
        dto.name = entity.className;
        dto.nameBook = entity.bookName;
        dto.schedule = ClassScheduleDto.toDto(entity);
        dto.students = ClassStudentDto.toDto(entity.students);
        dto.teacher = ClassTeacherDto.toDto(entity.teacher);
        return dto;
    }
}

export class ClassStudentDto {
    id: string;
    name: string;

    static toDto(entities: StudentEntity[]): ClassStudentDto[]{
        let dtos : ClassStudentDto[] = [];
        if(entities){
            entities.forEach(it =>{
                let dto = new ClassStudentDto();
                dto.id = it.id;
                dto.name = it.fullName;
                dtos.push(dto);
            });
        }
        return dtos;
    }
}

export class ClassTeacherDto {
    id: string;
    name: string;

    static toDto(teacher: WorkerEntity): ClassTeacherDto{
        let dto = new ClassTeacherDto();
        if(teacher){
            dto.id = teacher.id;
            dto.name = teacher.fullName;
        };
        return dto;
    }
}

export class  ClassScheduleDto {

    dayOfWeeks: string[] = [];
    times: Record<string, string> = {};

    static toDto(entity: ClassEntity): ClassScheduleDto {
        let dto = new ClassScheduleDto();
        dto.dayOfWeeks.push(entity.firstDayOfClassInWeek);
        dto.dayOfWeeks.push(entity.secondDayOfClassInWeek);
        let t = new Map();
        t.set(entity.firstDayOfClassInWeek, entity.timeFirstDay);
        t.set(entity.secondDayOfClassInWeek, entity.timeSecondDay);
        dto.times = Object.fromEntries(t);
        return dto;
    }
}