import { TransferStudendtsRequestDto } from '../../../src/infrastructure/api/controllers/student/dto/transfer-students-request-dto';

type TransferStudendtsRequestDtoMock = {
    studentIds?: string[];
    classId?: string;
}

export function mockTransferStudendtsRequestDto(
    overrides: TransferStudendtsRequestDtoMock = {}
): TransferStudendtsRequestDto {
    const dto = new TransferStudendtsRequestDto();
    dto.studentIds = overrides.studentIds ?? ['1233', '1234'];
    dto.classId = overrides.classId ?? '123';
    return dto;
}   
