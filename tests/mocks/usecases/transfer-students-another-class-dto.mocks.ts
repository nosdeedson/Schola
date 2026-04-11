import { TransferStudentsAnotherClassUseCaseDto } from "../../../src/application/usecases/transfer-students/transfer-students-another-class-usecase-dto";

type TransferStudentsAnotherClassDtoMock = {
    studentIds?: string[];
    classId?: string;
}

export function mockTransferStudentsAnotherClassDto(
    overrides: TransferStudentsAnotherClassDtoMock = {}
): TransferStudentsAnotherClassUseCaseDto {
    return new TransferStudentsAnotherClassUseCaseDto(
        overrides.studentIds ?? ['1234', '123'],
        overrides.classId ?? "123",
    )
}
