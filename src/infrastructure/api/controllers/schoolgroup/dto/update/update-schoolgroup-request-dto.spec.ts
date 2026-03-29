import { UpdateSchoolgroupRequestDto } from './update-schoolgroup-request-dto';
import {WorkerEntity} from '../../../../../entities/worker/worker.entity';
import {DomainMocks} from '../../../../../__mocks__/mocks'
import { RoleEnum } from '../../../../../../domain/worker/roleEnum';

describe('UpdateSchoolgroupDto', () => {

    it('should be defined', () => {
        expect(new UpdateSchoolgroupRequestDto()).toBeDefined();
    })

    it('should return a UpdateClassDto', () => {
        let dto = new UpdateSchoolgroupRequestDto();
        dto.id = "16efc675-a208-43fe-93dd-8b9a3eebe656";
        dto.nameBook = 'name book';
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        let input = dto.toInput(teacher);
        expect(input).toBeDefined();
        expect(input.id).toBe(dto.id);
        expect(input.nameBook).toBe(dto.nameBook);
    })
})