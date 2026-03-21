export class UpdateAcademicSemesterDto {
    id: string;
    updatingQuarter: boolean;
    updatingSemester: boolean;

    constructor(params: {
        id: string,
        updatingQuarter: boolean,
        updatingSemester: boolean,
    }) {
        const { id, updatingQuarter, updatingSemester } = params;
        this.id = id;
        this.updatingQuarter = updatingQuarter
        this.updatingSemester = updatingSemester;
    }
}