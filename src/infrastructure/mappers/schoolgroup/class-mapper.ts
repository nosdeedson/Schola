import { Class } from "@/domain/class/class";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { ScheduleMapper } from "../schedule/schedule-mapper";
import { StudentMapper } from "../student/student-mapper";
import { WorkerMapper } from "../worker/worker-mapper";

export class ClassMapper {

    static fromDomain(domain: Class): ClassEntity {
        if (!domain) {
            return null;
        }
        let entity = new ClassEntity();
        entity.bookName = domain.getNameBook();
        entity.classCode = domain.getClassCode();
        entity.className = domain.getName();
        entity.createdAt = domain.getCreatedAt();
        entity.deletedAt = domain.getDeletedAt();
        entity.firstDayOfClassInWeek = domain.getSchecule().getDayOfWeek()[0];
        entity.id = domain.getId();
        entity.secondDayOfClassInWeek = domain.getSchecule().getDayOfWeek()[1];
        entity.timeFirstDay = domain.getSchecule().getTimes().get(entity.firstDayOfClassInWeek);
        entity.timeSecondDay = domain.getSchecule().getTimes().get(entity.secondDayOfClassInWeek);
        entity.updatedAt = domain.getUpdatedAt();
        if (domain.getStudents()) {
            entity.students = StudentMapper.toStudentsEntities(domain.getStudents());
        }
        if (domain.getTeacher()) {
            entity.setTeacher(WorkerMapper.fromDomain(domain.getTeacher()));
        }
        return entity;
    }

    static fromEntity(entity: ClassEntity): Class {
        if(!entity) return null;
        let domain = new Class(
            entity.classCode,
            entity.bookName,
            entity.className,
            ScheduleMapper.fromEntity(entity),
            entity?.id,
            entity?.createdAt,
            entity?.updatedAt,
            entity?.deletedAt,
        );
        const students = entity.students ? entity.students.map(it => StudentMapper.fromEntity(it)) : [];
        domain.setStudents(students);
        const teacher = entity.teacher ? WorkerMapper.fromEntity(entity.teacher) : null;
        domain.setTeacher(teacher);
        return domain;
    }
}
