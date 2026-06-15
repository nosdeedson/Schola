import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Class } from "@/domain/class/class";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";

export class TeacherClassRatingDto {
    teacherId: string;
    students: StudentInfoDto[] = [];
    classId: string;
    className: string;
    bookName: string;
    daysOfClass: ClassInfoDto[] = [];
    semester: SemesterInfoDto;

    constructor(classEntity: Class, semester: AcademicSemester) {
        if (!classEntity || !semester) {
            return this;
        }
        classEntity.getStudents().forEach(it => {
            const studentInfo = new StudentInfoDto(it.getName(), it.getId());
            this.students.push(studentInfo);
        });
        this.teacherId = classEntity.getTeacher().getId();
        this.classId = classEntity.getId();
        this.className = classEntity.getName();
        this.bookName = classEntity.getNameBook();
        const firstTime = classEntity.getSchecule().getTime(classEntity.getSchecule().getDayOfWeek()[0]);
        const firstDay = new ClassInfoDto(classEntity.getSchecule().getDayOfWeek()[0], firstTime);
        this.daysOfClass.push(firstDay);
        const secondTime = classEntity.getSchecule().getTime(classEntity.getSchecule().getDayOfWeek()[1]);
        const secondDay = new ClassInfoDto(classEntity.getSchecule().getDayOfWeek()[1], secondTime);
        this.daysOfClass.push(secondDay);
        this.semester = new SemesterInfoDto(semester);
    }

}

class StudentInfoDto {
    name: string;
    idStudent: string;
    constructor(name: string, idStudent: string) {
        this.name = name;
        this.idStudent = idStudent;
    }
}

class ClassInfoDto {
    dayOfClass: string;
    timeOfClass: string;
    constructor(dayOfClass: string, timeOfClass: string) {
        this.dayOfClass = dayOfClass;
        this.timeOfClass = timeOfClass;
    }
}

class SemesterInfoDto {
    firstQuarter: QuarterDto;
    secondQuarter: QuarterDto;
    current: boolean;
    constructor(semester: AcademicSemester) {
        const first = semester.getFirstQuarter();
        const second = semester.getSecondQuarter();
        this.firstQuarter = QuarterDto.fromDomain(first);
        this.secondQuarter = QuarterDto.fromDomain(second);
        this.current = semester?.getCurrentSemester();
    }
}
