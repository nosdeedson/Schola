import { ClassEntity } from "@/infrastructure/entities/class/class.entity";

export class ClassesOfTeacherDto {
    teacherId: string;
    students: StudentInfoDto[] = [];
    classId: string;
    className: string;
    bookName: string;
    daysOfClass: ClassInfoDto[] = [];

    constructor(classEntity: ClassEntity){
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
    }

    static toClassesOfTeacher(classes: ClassEntity[]): ClassesOfTeacherDto[]{
        let myClasses: ClassesOfTeacherDto[] = [];
        if(classes.length > 0){
            classes.forEach(it => {
                myClasses.push(new ClassesOfTeacherDto(it));
            });
        }
        return myClasses;
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