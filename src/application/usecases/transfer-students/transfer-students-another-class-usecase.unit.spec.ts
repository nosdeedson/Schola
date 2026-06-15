import { MockRepositoriesForUnitTest } from "../../../../tests/mocks/mock-repositories/mockRepositories";
import { TransferStudentsAnotherClassUsecase } from "./transfer-students-another-class.usecase";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { NotFoundException } from "@nestjs/common";
import { mockTransferStudentsAnotherClassDto } from '../../../../tests/mocks/usecases/transfer-students-another-class-dto.mocks';
import { mockClass } from "../../../../tests/mocks/domain/class.mocks";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";

describe('TransferStudentsAnotherClassUsecase unit tests', () => {
    it('should not find the class', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn().mockResolvedValue(null);

        const usecase = new TransferStudentsAnotherClassUsecase(studentRepository, classRepository);
        const tratrarErrors = jest.spyOn(ExceptionHandler, "exceptionHandler")
            .mockImplementation(() => { throw new NotFoundException('class not found') });
        const dto = mockTransferStudentsAnotherClassDto();
        await expect(usecase.execute(dto)).rejects.toMatchObject(new NotFoundException('class not found'));
        expect(classRepository.find).toHaveBeenCalledTimes(1);
        expect(classRepository.find).toHaveBeenCalledWith(dto.classId);
        expect(tratrarErrors).toHaveBeenCalledTimes(1);
    });

    it('should udpate students', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const class1 = mockClass();
        const student = mockStudent();
        const dto = mockTransferStudentsAnotherClassDto();

        classRepository.find = jest.fn().mockResolvedValue(class1);
        studentRepository.findByIds = jest.fn().mockResolvedValue([student]);
        studentRepository.updateAll = jest.fn().mockResolvedValue(void 0);

        const usecase = new TransferStudentsAnotherClassUsecase(studentRepository, classRepository);
        expect(await usecase.execute(dto)).toBe(void 0);
        expect(classRepository.find).toHaveBeenCalledTimes(1);
    });
});
