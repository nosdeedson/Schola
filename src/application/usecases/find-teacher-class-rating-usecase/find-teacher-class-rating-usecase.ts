import { FindCurrentSemesterService } from "@/application/services/academic-semester/find-current/find-current-semester.service";
import { FindTeacherClassRatingService } from "@/application/services/class/find-teacher-class-rating/find-teacher-class-rating";
import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { TeacherClassRatingDto } from "./find-teacher-class-rating-dto";

export class FindTeacherClassRatingUsecase {

    constructor(
        private classRepository: ClassRepositoryInterface,
        private semesterRepository: AcademicSemesterInterface,
    ) { }

    async execute(teacherId: string, classId: string): Promise<TeacherClassRatingDto> {
        try {
            const service = new FindTeacherClassRatingService(this.classRepository);
            const classEntity = await service.execute(teacherId, classId);
            const semesterService = new FindCurrentSemesterService(this.semesterRepository);
            const semester = await semesterService.execute();
            return new TeacherClassRatingDto(classEntity, semester);
        } catch (error) {
            throw error;
        }
    }
}
