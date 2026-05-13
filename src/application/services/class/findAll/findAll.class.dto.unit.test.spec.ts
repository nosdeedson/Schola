import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { FindAllClassDto } from './findAll.class.dto';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { Class } from '../../../../domain/class/class';

// jest.mock('./findAll.class.dto.ts')

describe('findAllClassDto unit test', () =>{

    let schoolgroup: Class;

    beforeEach(() =>{
        schoolgroup = DomainMocks.mockSchoolGroup();
    })

    afterEach( () =>{
        jest.clearAllMocks();
    })

    it('should return dto with all empty', () =>{
        const mockRepository = MockRepositoriesForUnitTest.mockRepositories();
        mockRepository.findAll = jest.fn().mockReturnValueOnce(null);
        const entities = mockRepository.findAll();

        const dtos = new FindAllClassDto(entities);
        expect(dtos).toBeDefined();
        expect(dtos.all).toBeDefined();
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);

    });

    it('should return dto with one class', () =>{
        const mockRepository = MockRepositoriesForUnitTest.mockRepositories();
        const entity = ClassEntity.toClassEntity(schoolgroup);
        mockRepository.findAll = jest.fn().mockReturnValueOnce([entity]);
        const entities = mockRepository.findAll();

        const dtos = new FindAllClassDto(entities);

        expect(dtos).toBeDefined();
        expect(dtos.all.length).toBe(1);
        expect(dtos.all[0].classCode).toEqual(entity.classCode);
        expect(dtos.all[0].id).toEqual(entity.id);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

})