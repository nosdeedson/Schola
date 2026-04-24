import { FindUserDto } from "../../../application/services/user/find/find.user.dto";
import { AccessType } from "../../../domain/user/access.type";
import { FindWorkerDto } from '../../../application/services/worker/find/find.worker.dto'
import { RoleEnum } from "../../../domain/worker/roleEnum";
import { CreateUserRequestDto } from "../../api/controllers/users/dtos/create-user-dto/create-user-request-dto";
import { ClassesOfTeacherDto } from "../../../application/usecases/teacher-list-classes-usecase/classes-of-teacher-dto";
import { TeacherClassRatingDto } from "../../../application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-dto";
import { mockQuarterDto } from "../../../../tests/mocks/domain-dto/quarter-dto.mocks";

export function mockFindUserDto(
    overrides: Partial<FindUserDto> = {},
): FindUserDto {
    return {
        id: '6956c177-6bf8-8326-afdf-61bafe1207d1',
        personId: '8204a6ee-b80b-4ace-9b32-92a11195cda4',
        email: 'john.doe@example.com',
        nickname: 'johndoe',
        name: 'john doe',
        accessType: AccessType.TEACHER,
        ...overrides,
    } as FindUserDto;
}

export function mockOutputFindWorkerDto(
    overrides: Partial<FindWorkerDto> = {},
): FindWorkerDto {
    return {
        id: '6956c177-6bf8-8326-afdf-61bafe1207d1',
        createdAt: new Date(),
        udpatedAt: new Date(),
        birthday: new Date(),
        name: 'john doe',
        role: RoleEnum.TEACHER,
        ...overrides,
    }
}


export function mockCreateUsersDto(
    overrides: Partial<CreateUserRequestDto> = {},
): CreateUserRequestDto {
    return {
        name: 'worker',
        birthDate: '2025-02-03T12:00:00Z',
        email: 'worker@email.com',
        password: '1234@Mudar',
        accessType: AccessType.ADMIN,
        classCode: "1234",
        nickname: 'worker',
        ...overrides
    }
}

export function mockClassesOfTeacherDto(): ClassesOfTeacherDto {
    return {
        "students": [
            {
                "name": "João Silva",
                "idStudent": "student-1"
            },
            {
                "name": "Maria Souza",
                "idStudent": "student-2"
            }
        ],
        "classId": "class-123",
        "className": "English Beginner",
        "bookName": "English Book A1",
        "daysOfClass": [
            {
                "dayOfClass": "Monday",
                "timeOfClass": "18:00"
            },
            {
                "dayOfClass": "Wednesday",
                "timeOfClass": "18:00"
            }
        ]
    } as ClassesOfTeacherDto;
}


export function mockTeacherClassRatingDto(): TeacherClassRatingDto {
    return {
        "teacherId": "teacher-123",
        "students": [
            {
                "name": "John Doe",
                "idStudent": "student-001"
            },
            {
                "name": "Jane Smith",
                "idStudent": "student-002"
            }
        ],
        "classId": "class-789",
        "className": "English Advanced",
        "bookName": "English Grammar in Use",
        "daysOfClass": [
            {
                "dayOfClass": "Monday",
                "timeOfClass": "18:00"
            },
            {
                "dayOfClass": "Wednesday",
                "timeOfClass": "18:00"
            }
        ],
        "semester": {
            "firstQuarter": mockQuarterDto(),
            "secondQuarter": mockQuarterDto(),
            "current": true
        } 
    } as TeacherClassRatingDto;
}