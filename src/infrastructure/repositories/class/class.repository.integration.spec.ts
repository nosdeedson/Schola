import { ClassRepository } from '../class/class.repository';
import { ClassEntity } from '../../entities/class/class.entity';
import { Class } from '../../../domain/class/class';
import { TestDataSource } from '../config-test/test.datasource';
import { WorkerEntity } from '../../entities/worker/worker.entity';
import { WorkerRepository } from '../worker/worker.repository';
import { StudentEntity } from '../../entities/student/student.entity';
import { StudentRepository } from '../student/student.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { mockClass } from '../../../../tests/mocks/domain/class.mocks';
import { mockSchedule } from '../../../../tests/mocks/domain/schedule.mocks';
import { mockStudent } from '../../../../tests/mocks/domain/student.mocks';
import { mockWorker } from '../../../../tests/mocks/domain/worker.mock';
import { ClassMapper } from '@/infrastructure/mappers/schoolgroup/class-mapper';
import { StudentMapper } from '@/infrastructure/mappers/student/student-mapper';
import { WorkerMapper } from '@/infrastructure/mappers/worker/worker-mapper';
import { Worker } from '@/domain/worker/worker';
import { Student } from '@/domain/student/student';

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
        studentRepository = new StudentRepository(TestDataSource);
    });

    it('classRepository must be instantiate', async () => {
        expect(classRepository).toBeDefined();
    })

    it('should save a class on BD', async () => {
        let schoolGroup = mockClass();
        let classModel = ClassMapper.fromDomain(schoolGroup);
        let wantedId = schoolGroup.getId();
        expect(await classRepository.create(classModel)).toBeInstanceOf(Class);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);

    })

    it('should delete a class on BD', async () => {
        let schedule = mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassMapper.fromDomain(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(Class);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(await classRepository.delete(wantedId)).toBe(void 0);
    })

    it('should find a class on BD', async () => {
        let schedule = mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassMapper.fromDomain(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(Class);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
        expect(result.getSchecule().getDayOfWeek()[0]).toEqual(schoolGroup.getSchecule().getDayOfWeek()[0]);
        expect(result.getSchecule().getDayOfWeek()[1]).toEqual(schoolGroup.getSchecule().getDayOfWeek()[1]);
    })

    it('should find all class on BD', async () => {
        let schedule = mockSchedule();
        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, '2ac4ba35-a052-439f-91dc-1a85c655a339');
        let classModel = ClassMapper.fromDomain(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(Class);
        let schoolGroup2 = new Class('1234', 'nameBook', 'a1', schedule, '2ac4ba35-a052-439f-91dc-1a85c655a340');
        let classModel2 = ClassMapper.fromDomain(schoolGroup2);
        expect(await classRepository.create(classModel2)).toBeInstanceOf(Class);

        let results = await classRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].getSchecule().getDayOfWeek()[0]).toEqual(schoolGroup.getSchecule().getDayOfWeek()[0]);
        expect(results[0].getSchecule().getDayOfWeek()[1]).toEqual(schoolGroup.getSchecule().getDayOfWeek()[1]);
    })

    it('should update a class on BD', async () => {
        let schedule = mockSchedule();
        let wantedId = '2ac4ba35-a052-439f-91dc-1a85c655a339';

        let schoolGroup = new Class('1234', 'nameBook', 'a1', schedule, wantedId);
        let classModel = ClassMapper.fromDomain(schoolGroup);
        expect(await classRepository.create(classModel)).toBeInstanceOf(Class);
        let result = await classRepository.find(wantedId);
        expect(result).toBeDefined();
        let wantedBookName = 'another book';
        let wantedClassName = 'b1';
        classModel.bookName = wantedBookName;
        classModel.className = wantedClassName;
        await classRepository.update(classModel);

        result = await classRepository.find(wantedId);

        expect(result.getId()).toEqual(wantedId);
        expect(result.getNameBook()).toEqual(wantedBookName);
        expect(result.getName()).toEqual(wantedClassName);
    });

    it('findByTeacherId should find a class', async () => {
        const student1 = mockStudent();
        const student2 = mockStudent();
        const studentEntity1 = StudentMapper.fromDomain(student1);
        const studentEntity2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(Student);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(Student);

        const teacher = mockWorker();
        const classModel = mockClass();
        teacher.setClass(classModel);
        const teacherEntity = WorkerMapper.fromDomain(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const wantedIdTeacher = teacher.getId();
        const results = await classRepository.findByTeacherId(wantedIdTeacher);
        expect(results).toBeDefined();
        expect(results[0].getNameBook()).toBe(classModel.getNameBook());
        expect(results[0].getId()).toBe(classModel.getId());
        expect(results[0].getName()).toBe(classModel.getName());
        expect(results[0].getStudents().length).toBe(2);
    });

    it('findByTeacherId should not find a class if the id does not exist', async () => {
        const student1 = mockStudent();
        const student2 = mockStudent();
        const studentEntity1 = StudentMapper.fromDomain(student1);
        const studentEntity2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(Student);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(Student);

        const teacher = mockWorker();
        const classModel = mockClass();
        teacher.setClass(classModel);
        const teacherEntity = WorkerMapper.fromDomain(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const wrongTeacherId = ('0e62d8a3-0683-4a23-a2c1-1e7865cbd0b1');
        const results = await classRepository.findByTeacherId(wrongTeacherId);
        expect(results).toHaveLength(0);
        expect(results).toEqual([]);
    });

    it('findByTeacherIdAndClassId should find a class by teacherId and class id', async () => {
        const student1 = mockStudent();
        const student2 = mockStudent();
        const studentEntity1 = StudentMapper.fromDomain(student1);
        const studentEntity2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(Student);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(Student);

        const teacher = mockWorker();
        const classModel = mockClass();
        teacher.setClass(classModel);
        const teacherEntity = WorkerMapper.fromDomain(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        classModel.setStudents([student1, student2]);
        classModel.setTeacher(teacher);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const wantedTeacherId = teacher.getId();
        const wantedClassId = classModel.getId();
        const results = await classRepository.findByTeacherIdAndClassId(wantedTeacherId, wantedClassId);
        expect(results).toBeDefined();
        expect(results.getNameBook()).toBe(classModel.getNameBook());
        expect(results.getId()).toBe(classModel.getId());
        expect(results.getName()).toBe(classModel.getName());
        expect(results.getStudents().length).toBe(2);
    });

    it('findByTeacherIdAndClassId should not find a class by teacherId and class id when teacherId does not exist', async () => {
        const teacher = mockWorker();
        const classModel = mockClass();
        teacher.setClass(classModel);
        const teacherEntity = WorkerMapper.fromDomain(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        classModel.setTeacher(teacher);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const wrongTeacherId = '89199554-a3c1-411f-8c1b-f6f0ef599f55';
        const wantedClassId = classModel.getId();
        const results = await classRepository.findByTeacherIdAndClassId(wrongTeacherId, wantedClassId);
        expect(results).toBeNull();
    });

    it('findByTeacherIdAndClassId should not find a class by teacherId and class id when classId does not exist', async () => {
        const teacher = mockWorker();
        const classModel = mockClass();
        teacher.setClass(classModel);
        const teacherEntity = WorkerMapper.fromDomain(teacher);
        expect(await teacherRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        classModel.setTeacher(teacher);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const wantedTeacherId = teacher.getId();
        const wrondClassId = '574aa098-50e7-4942-8887-9c066aa9a16c';
        const results = await classRepository.findByTeacherIdAndClassId(wantedTeacherId, wrondClassId);
        expect(results).toBeNull;
    });

    it('should throw QueryFailedError error', async () => {
        const entity = new ClassEntity();
        await expect(classRepository.create(entity)).rejects.toThrow(QueryFailedError);
    });
});
