import { DomainMocks } from '../../__mocks__/mocks';
import { ClassRepository } from '../class/class.repository';
import { ClassEntity } from '../../entities/class/class.entity';
import { Class } from '../../../domain/class/class';
import { TestDataSource } from '../config-test/test.datasource';
import { WorkerEntity } from '../../entities/worker/worker.entity';
import { WorkerRepository } from '../worker/worker.repository';
import { StudentEntity } from '../../entities/student/student.entity';
import { StudentRepository } from '../student/student.repository';
import { Repository } from 'typeorm';
import { RoleEnum } from '../../../domain/worker/roleEnum';

describe('ClassRepository unit test', () => {

    let classModel;
    let classRepository: ClassRepository;

    let teacherModel: Repository<WorkerEntity>;
    let teacherRepository: WorkerRepository;

    let studentModel: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    beforeAll(() => {
        classModel = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
        teacherModel = TestDataSource.getRepository(WorkerEntity);
        teacherRepository = new WorkerRepository(TestDataSource);
        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentModel, TestDataSource);
    });

    it('classRepository must be instantiate', async () => {
        expect(classRepository).toBeDefined();
    })

    it('should save a class on BD', async () => {
        let schoolGroup = DomainMocks.mockSchoolGroup();
        let classModel = ClassEntity.toClassEntity(schoolGroup);
        let wantedId = schoolGroup.getId();
        expect(await classRepository.create(classModel)).toBeInstanceOf(ClassEntity);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);

    })

    it('should delete a class on BD', async () => {
        let schedule = DomainMocks.mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassEntity.toClassEntity(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(ClassEntity);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(await classRepository.delete(wantedId)).toBe(void 0);
    })

    it('should find a class on BD', async () => {
        let schedule = DomainMocks.mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassEntity.toClassEntity(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(ClassEntity);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
        expect(result.firstDayOfClassInWeek).toEqual(schoolGroup.getSchecule().getDayOfWeek()[0]);
        expect(result.secondDayOfClassInWeek).toEqual(schoolGroup.getSchecule().getDayOfWeek()[1]);
    })

    it('should find all class on BD', async () => {
        let schedule = DomainMocks.mockSchedule();
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, '2ac4ba35-a052-439f-91dc-1a85c655a339');
        let classModel = ClassEntity.toClassEntity(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(ClassEntity);
        let schoolGroup2 = new Class('1234', 'nameBook', 'a1', schedule, '2ac4ba35-a052-439f-91dc-1a85c655a340');
        let classModel2 = ClassEntity.toClassEntity(schoolGroup2);
        expect(await classRepository.create(classModel2)).toBeInstanceOf(ClassEntity);

        let results = await classRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].firstDayOfClassInWeek).toEqual(schoolGroup.getSchecule().getDayOfWeek()[0]);
        expect(results[0].secondDayOfClassInWeek).toEqual(schoolGroup.getSchecule().getDayOfWeek()[1]);
    })

    it('should update a class on BD', async () => {
        let schedule = DomainMocks.mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';

        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassEntity.toClassEntity(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(ClassEntity);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        let wantedBookName = 'another book';
        let wantedClassName = 'b1';
        classModel.bookName = wantedBookName;
        classModel.className = wantedClassName;
        await classRepository.update(classModel);

        result = await classRepository.find(wantedId);

        expect(result.id).toEqual(wantedId);
        expect(result.bookName).toEqual(wantedBookName);
        expect(result.className).toEqual(wantedClassName);
    });

    it('findByTeacherId should find a class', async () => {
        const student1 = DomainMocks.mockStudent();
        const student2 = DomainMocks.mockStudentWithoutParent();
        const studentEntity1 = StudentEntity.toStudentEntity(student1);
        const studentEntity2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(StudentEntity);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(StudentEntity);

        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const classModel = DomainMocks.mockSchoolGroup();
        teacher.setClass(classModel);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(ClassEntity);

        const wantedIdTeacher = teacher.getId();
        const results = await classRepository.findByTeacherId(wantedIdTeacher);
        expect(results).toBeDefined();
        expect(results[0].bookName).toBe(classModel.getNameBook());
        expect(results[0].id).toBe(classModel.getId());
        expect(results[0].className).toBe(classModel.getName());
        expect(results[0].students.length).toBe(2);
    });

    it('findByTeacherId should not find a class if the id does not exist', async () => {
        const student1 = DomainMocks.mockStudent();
        const student2 = DomainMocks.mockStudentWithoutParent();
        const studentEntity1 = StudentEntity.toStudentEntity(student1);
        const studentEntity2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(StudentEntity);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(StudentEntity);

        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const classModel = DomainMocks.mockSchoolGroup();
        teacher.setClass(classModel);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(ClassEntity);

        const wrongTeacherId = ('0e62d8a3-0683-4a23-a2c1-1e7865cbd0b1');
        const results = await classRepository.findByTeacherId(wrongTeacherId);
        expect(results).toHaveLength(0);
        expect(results).toEqual([]);
    });

    it('findByTeacherIdAndClassId should find a class by teacherId and class id', async () => {
        const student1 = DomainMocks.mockStudent();
        const student2 = DomainMocks.mockStudentWithoutParent();
        const studentEntity1 = StudentEntity.toStudentEntity(student1);
        const studentEntity2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(StudentEntity);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(StudentEntity);

        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const classModel = DomainMocks.mockSchoolGroup();
        teacher.setClass(classModel);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(ClassEntity);

        const wantedTeacherId = teacher.getId();
        const wantedClassId = classModel.getId();
        const results = await classRepository.findByTeacherIdAndClassId(wantedTeacherId, wantedClassId);
        expect(results).toBeDefined();
        expect(results.bookName).toBe(classModel.getNameBook());
        expect(results.id).toBe(classModel.getId());
        expect(results.className).toBe(classModel.getName());
        expect(results.students.length).toBe(2);
    });

    it('findByTeacherIdAndClassId should not find a class by teacherId and class id when teacherId does not exist', async () => {
        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const classModel = DomainMocks.mockSchoolGroup();
        teacher.setClass(classModel);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        classModel.setTeacher(teacher);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(ClassEntity);

        const wrongTeacherId = '89199554-a3c1-411f-8c1b-f6f0ef599f55';
        const wantedClassId = classModel.getId();
        const results = await classRepository.findByTeacherIdAndClassId(wrongTeacherId, wantedClassId);
        expect(results).toBeNull();
    });

    it('findByTeacherIdAndClassId should not find a class by teacherId and class id when classId does not exist', async () => {
        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const classModel = DomainMocks.mockSchoolGroup();
        teacher.setClass(classModel);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        classModel.setTeacher(teacher);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(ClassEntity);

        const wantedTeacherId = teacher.getId();
        const wrondClassId = '574aa098-50e7-4942-8887-9c066aa9a16c';
        const results = await classRepository.findByTeacherIdAndClassId(wantedTeacherId, wrondClassId);
        expect(results).toBeNull;
    });

});
