import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";
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

    constructor(classEntity: ClassEntity, semester: AcademicSemesterEntity){
        if(!classEntity || !semester){
            return this;
        }
        classEntity.students.forEach(it => {
            const studentInfo = new StudentInfoDto(it.fullName, it.id);
            this.students.push(studentInfo);
        });
        this.teacherId = classEntity.teacher.id;
        this.classId = classEntity.id;
        this.className = classEntity.className;
        this.bookName = classEntity.bookName;
        const firstDay = new ClassInfoDto(classEntity.firstDayOfClassInWeek, classEntity.timeFirstDay);
        this.daysOfClass.push(firstDay);
        const secondDay = new ClassInfoDto(classEntity.secondDayOfClassInWeek, classEntity.timeSecondDay);
        this.daysOfClass.push(secondDay);
        this.semester = new SemesterInfoDto(semester);
    }

}

class StudentInfoDto{
    name: string;
    idStudent: string;
    constructor(name: string, idStudent: string){
        this.name = name;
        this.idStudent = idStudent;
    }
}

class ClassInfoDto{
    dayOfClass: string;
    timeOfClass: string;
    constructor(dayOfClass: string, timeOfClass: string){
        this.dayOfClass = dayOfClass;
        this.timeOfClass = timeOfClass;
    }
}

class SemesterInfoDto{
    firstQuarter: QuarterDto;
    secondQuarter: QuarterDto;
    current: boolean;
    constructor(semester: AcademicSemesterEntity){
        const first = semester.quarters[0].quarterNumber == 1 ? semester.quarters[0] : semester.quarters[1];
        const second = semester.quarters[1].quarterNumber == 1 ? semester.quarters[1] : semester.quarters[0];
        this.firstQuarter = QuarterDto.fromDomain(first);
        this.secondQuarter = QuarterDto.fromDomain(second);
        this.current = semester?.current;
    }
}