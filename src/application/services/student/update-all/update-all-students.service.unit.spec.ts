import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";

describe('UpdateAllStudentsService unit test', () => {

    it('shoulg update all students', async () => {

        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.updateAll = jest.fn()
            .mockReturnValue(void 0);

        const entity1 = StudentMapper.fromDomain(mockStudent());
        const entity2 = StudentMapper.fromDomain(mockStudent({ name: 'test 2' }));
        expect(await studentRepository.updateAll([entity1, entity2])).toBe(void 0);
        expect(studentRepository.updateAll).toHaveBeenCalledTimes(1);
        expect(studentRepository.updateAll).toHaveBeenCalledWith([entity1, entity2]);
    })
});
