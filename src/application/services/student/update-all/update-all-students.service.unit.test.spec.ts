import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";

describe('UpdateAllStudentsService unit test', () => {

    it('shoulg update all students', async () => {

        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.updateAll = jest.fn()
            .mockReturnValue(void 0);

        const entity1 = StudentEntity.toStudentEntity(mockStudent());
        const entity2 = StudentEntity.toStudentEntity(mockStudent({ name: 'test 2' }));
        expect(await studentRepository.updateAll([entity1, entity2])).toBe(void 0);
        expect(studentRepository.updateAll).toHaveBeenCalledTimes(1);
        expect(studentRepository.updateAll).toHaveBeenCalledWith([entity1, entity2]);
    })
});
