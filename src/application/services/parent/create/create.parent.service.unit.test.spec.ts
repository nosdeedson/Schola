import { mockParent, mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { CreateParentDto, } from './create.parent.dto';
import { CreateParentService } from './create.parent.service';


describe('CreateParentService unit tests', () => {

    it('should find a parent and update its value', async () => {
        const parentMock = mockParent();
        const mockEntity = ParentEntity.toParentEntity(parentMock);

        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(mockEntity));
        const dto = new CreateParentDto(parentMock.getBirthday(), parentMock.getName(), ['jose']);
        const service = new CreateParentService(parentRepository);

        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(ParentEntity);
        expect(result).toMatchObject(mockEntity);
        expect(parentRepository.update).toHaveBeenCalledTimes(1);
        expect(parentRepository.findByParentNameAndStudentNames).toHaveBeenCalledTimes(1);
    });

    it('should save the parrent', async () => {
        const parentMock = mockParent();
        const mockEntity = ParentEntity.toParentEntity(parentMock);
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(null));
        parentRepository.create = jest.fn()
            .mockImplementation(async () => await Promise.resolve(mockEntity));

        const dto = new CreateParentDto(parentMock.getBirthday(), parentMock.getName(), ['jose']);
        const service = new CreateParentService(parentRepository);
        
        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(ParentEntity);
        expect(result).toMatchObject(ParentEntity.toParentEntity(parentMock));
        expect(parentRepository.create).toHaveBeenCalledTimes(1);
        expect(parentRepository.findByParentNameAndStudentNames).toHaveBeenCalledTimes(1);
    });

    // name required 
    it('should throw an error while trying to save a parent without name', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(null));
        let name: any;
        const dto = new CreateParentDto(new Date(), name, ['jose']);
        const service = new CreateParentService(parentRepository);
        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [
                { context: 'parent', message: 'Name should not be null' },
            ],
        });
    });

    // birthday: required 
    it('should throw an error while trying to save a parent without birthday', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(null));
        let birthday: any;
        const dto = new CreateParentDto(birthday, 'edson', ['jose']);
        const service = new CreateParentService(parentRepository);
        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [
                { context: 'parent', message: 'Birthday should not be null' },
            ],
        });
    });
    
});