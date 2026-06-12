import { Class } from "@/domain/class/class";
import { Student } from "@/domain/student/student";
import { Worker } from "@/domain/worker/worker";
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

    static toDto(entity: Class): FindClassDto {
        let dto = new FindClassDto();
        dto.id = entity.getId();
        dto.classCode = entity.getClassCode();
        dto.name = entity.getName();
        dto.nameBook = entity.getNameBook();
        dto.schedule = FindClassScheduleDto.toDto(entity);
        dto.students = FindClassStudentDto.toDto(entity.getStudents());
        dto.teacher = FindClassTeacherDto.toDto(entity.getTeacher());
        return dto;
    }
}

export class FindClassStudentDto {
    id: string;
    name: string;

    static toDto(entities: Student[]): FindClassStudentDto[]{
        let dtos : FindClassStudentDto[] = [];
        if(entities){
            entities.forEach(it =>{
                let dto = new FindClassStudentDto();
                dto.id = it.getId();
                dto.name = it.getName();
                dtos.push(dto);
            });
        }
        return dtos;
    }
}

export class FindClassTeacherDto {
    id: string;
    name: string;

    static toDto(teacher: Worker): FindClassTeacherDto{
        let dto = new FindClassTeacherDto();
        if(teacher){
            dto.id = teacher.getId();
            dto.name = teacher.getName();
        };
        return dto;
    }
}

export class  FindClassScheduleDto {

    dayOfWeeks: string[] = [];
    times: Record<string, string> = {};

    static toDto(entity: Class): FindClassScheduleDto {
        let dto = new FindClassScheduleDto();
        dto.dayOfWeeks = entity.getSchecule().getDayOfWeek();
        let t = entity.getSchecule().getTimes();
        dto.times = Object.fromEntries(t);
        return dto;
    }
}