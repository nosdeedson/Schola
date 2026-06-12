import { FindAllClassDto } from './findAll.class.dto';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { Class } from '../../../../domain/class/class';
import { mockClass } from '../../../../../tests/mocks/domain/class.mocks';
import { ClassMapper } from '@/infrastructure/mappers/schoolgroup/class-mapper';

describe('findAllClassDto unit test', () =>{

    let schoolgroup: Class;

    beforeEach(() =>{
        schoolgroup = mockClass();
    })

    afterEach( () =>{
        jest.clearAllMocks();
    })

    it('should return dto with all empty', () =>{
        const entities: Class[] = [];

        const dtos = new FindAllClassDto(entities);
        expect(dtos).toBeDefined();
        expect(dtos.all).toBeDefined();
    });

    it('should return dto with one class', () =>{
        const classDomain = mockClass()

        const dtos = new FindAllClassDto([classDomain]);

        expect(dtos).toBeDefined();
        expect(dtos.all.length).toBe(1);
        expect(dtos.all[0].classCode).toEqual(classDomain.getClassCode());
        expect(dtos.all[0].id).toEqual(classDomain.getId());
    });

});