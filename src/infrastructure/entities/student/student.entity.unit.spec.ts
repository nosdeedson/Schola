import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { Student } from "../../../domain/student/student";
import { StudentEntity } from "./student.entity"

describe("StudentModel unit test", () => {

    let student: Student;
    let student1: Student;
    let students: Student[];

    beforeEach(() => {
        student = mockStudent();
        student1 = mockStudent();
        students = [];
        students.push(student)
        students.push(student1)
    });

    it('should instantiate a studentModel', () => {
        let model = StudentEntity.toStudentEntity(student);
        expect(model.id).toEqual(student.getId())
        expect(model.birthday).toEqual(student.getBirthday())
        expect(model.createdAt).toEqual(student.getCreatedAt())
        expect(model.deletedAt).toEqual(student.getDeletedAt())
        expect(model.enrolled).toEqual(student.getEnrolled())
        expect(model.fullName).toEqual(student.getName())
        expect(model.schoolGroup).toBeDefined()
        expect(model.updatedAt).toEqual(student.getUpdatedAt())
    });

    it('should instantiate an array of sudents model', () => {
        let models = StudentEntity.toStudentsEntities(students);
        expect(models).toBeDefined();
        expect(models.length).toBe(2);
        expect(models[0].id).toStrictEqual(student.getId())
        expect(models[1].id).toStrictEqual(student1.getId())
    });

    it('should instantiate an array of sudents model', () => {
        let student = mockStudent();
        try {
            let model = StudentEntity.toStudentEntity(student);
        } catch (error) {
            //@ts-ignore
            expect(error.message).toEqual('should inform at least one parent')
        }
    });

});