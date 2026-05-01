import { Repository } from "typeorm";
import { AcademicSemester } from "../../../../domain/academc-semester/academic.semester";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { FindAcademicSemesterService } from "./find.academic-semester.service";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";

describe('Academic semester find integrations tests', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    let semester: AcademicSemester;

    beforeAll(async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
    });

    afterEach(async () =>{
        jest.clearAllMocks();
    });

    it('model and repository should be instantiated', async () =>{
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined()
    })

    it('should find an academicSemester on BD', async () =>{
        let semester = mockSemester();
        let entity = AcademicSemesterEntity.toEntity(semester);
        let wantedId = semester.getId();
        var inBD = await semesterRepository.find(wantedId);
        expect(inBD).toBeNull()
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const service = new FindAcademicSemesterService(semesterRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
    })  

    it('should not find an academicSemester on BD', async () =>{
       let semester = mockSemester();
        let entity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        let doesNotExist = 'a8b3ddcd-936e-4a35-8d85-6ddde1b019ed';
        const service = new FindAcademicSemesterService(semesterRepository);
        await expect(service.execute(doesNotExist))
         .rejects.toMatchObject({errors: [{context: 'academicSemester', message: 'Academic Semester not found'}]});
    });  
});