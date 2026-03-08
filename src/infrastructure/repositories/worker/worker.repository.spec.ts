import { RoleEnum } from "../../../domain/worker/roleEnum";
import { Worker } from "../../../domain/worker/worker";
import { DomainMocks } from '../../__mocks__/mocks';
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { WorkerRepository } from "./worker.repository";
import { TestDataSource } from "../config-test/test.datasource";


const MILISECONDS = 1000;

describe("WorkerRepository unit tets", () =>{

    let workerModel;
    let repository: WorkerRepository;
    beforeAll( () => {
        workerModel = TestDataSource.getRepository(WorkerEntity);
        repository = new WorkerRepository(workerModel, TestDataSource);
    });

    it('should instantiate a workerRepository', () =>{
        expect(repository).toBeDefined();
    })

    it('should delete a worker entity in the database', async () =>{
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId});
        let model = WorkerEntity.toWorkerEntity(admin);
        await repository.create(model);
        expect(await repository.delete(expectedId)).toBe(void 0);
    })

    it('should create a worker entity in the database', async () =>{
        let worker = DomainMocks.mockWorker(RoleEnum.ADMINISTRATOR);
        let model = WorkerEntity.toWorkerEntity(worker);
        let id = worker.getId();
        await repository.create(model);
        let result = await repository.find(id);
        expect(result).toBeDefined();
        expect(result.birthday).toEqual(model.birthday);
        expect(result.role).toEqual(model.role)
        expect(result.id).toEqual(model.id)
    });

    it('should find a worker entity in the database', async () =>{
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId});
        let model = WorkerEntity.toWorkerEntity(admin);
        await repository.create(model);
        let result = await repository.find(expectedId);
        expect(result).toBeDefined();
        expect(result.birthday).toEqual(model.birthday);
        expect(result.role).toEqual(model.role)
        expect(result.id).toEqual(model.id)
    });


    it('should find all workers entity in the database', async () =>{
        let worker1 = DomainMocks.mockWorker(RoleEnum.ADMINISTRATOR);
        let model = WorkerEntity.toWorkerEntity(worker1);
        let worker2 = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let model2 = WorkerEntity.toWorkerEntity(worker2);
        await repository.create(model);
        await repository.create(model2);
        let results = await repository.findAll();
        expect(results.length).toBe(2);
        expect(results[0].id).toEqual(model.id)
        expect(results[0].role).toEqual(model.role)
        expect(results[1].id).toEqual(model2.id)
        expect(results[1].role).toEqual(model2.role)
    });

    it('should udpate a workers entity in the database', async () =>{
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId});
        let model = WorkerEntity.toWorkerEntity(admin);
        let worker2 = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let model2 = WorkerEntity.toWorkerEntity(worker2);
        await repository.create(model);
        expect(await repository.update(model2)).toBe(void 0);
        let result = await repository.find(expectedId);
        expect(result).toBeDefined()
        //expect(result).toStrictEqual(model2)
    });

    it('should find teacher entity by name', async () =>{
        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await repository.create(model)).toBeInstanceOf(WorkerEntity);
        let entity = await repository.findByName(model.fullName);
        expect(entity).toBeDefined();
        expect(entity.id).toEqual(model.id);
        expect(entity.role).toEqual(model.role);
    });

})