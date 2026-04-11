export class TransferStudentsAnotherClassUseCaseDto {
    studentIds: string[] = [];
    classId: string;

    constructor(
        studentIds: string[],
        classId: string
    ) {
        this.studentIds = studentIds;
        this.classId = classId;
    }
}
