import { Class } from "@/domain/class/class";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";

export class ClassesOfTeacherDto {
    teacherId: string;
    students: StudentInfoDto[] = [];
    classId: string;
    className: string;
    bookName: string;
    daysOfClass: ClassInfoDto[] = [];

    constructor(classEntity: Class){
        classEntity.getStudents().forEach(it => {
            const studentInfo = new StudentInfoDto(it.getName(), it.getId());
            this.students.push(studentInfo);
        });
        this.teacherId = classEntity.getTeacher().getId();
        this.classId = classEntity.getId();
        this.className = classEntity.getName();
        this.bookName = classEntity.getNameBook();
        const firstDay = new ClassInfoDto(classEntity.getSchecule().getDayOfWeek()[0], classEntity.getSchecule().getTimes()[0]);
        this.daysOfClass.push(firstDay);
        const secondDay = new ClassInfoDto(classEntity.getSchecule().getDayOfWeek()[0], classEntity.getSchecule().getTimes()[0]);
        this.daysOfClass.push(secondDay);
    }

    static toClassesOfTeacher(classes: Class[]): ClassesOfTeacherDto[]{
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