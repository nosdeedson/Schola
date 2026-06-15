import { RoleEnum } from "../../../domain/worker/roleEnum";
import { Worker } from "../../../domain/worker/worker";
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { WorkerRepository } from "./worker.repository";
import { TestDataSource } from "../config-test/test.datasource";
import { mockWorker } from "../../../../tests/mocks/domain/worker.mock";
import { QueryFailedError } from "typeorm";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";


const MILISECONDS = 1000;

describe("WorkerRepository unit tets", () => {

    let workerModel;
    let repository: WorkerRepository;
    beforeAll(() => {
        workerModel = TestDataSource.getRepository(WorkerEntity);
        repository = new WorkerRepository(TestDataSource);
    });

    it('should instantiate a workerRepository', () => {
        expect(repository).toBeDefined();
    })

    it('should delete a worker entity in the database', async () => {
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId });
        let model = WorkerMapper.fromDomain(admin);
        await repository.create(model);
        expect(await repository.delete(expectedId)).toBe(void 0);
    })

    it('should create a worker entity in the database', async () => {
        let worker = mockWorker({ role: RoleEnum.ADMINISTRATOR });
        let model = WorkerMapper.fromDomain(worker);
        let id = worker.getId();
        await repository.create(model);
        let result = await repository.find(id);
        expect(result).toBeDefined();
        expect(result.getBirthday()).toEqual(model.birthday);
        expect(result.getRole()).toEqual(model.role)
        expect(result.getId()).toEqual(model.id)
    });

    it('should find a worker entity in the database', async () => {
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId });
        let model = WorkerMapper.fromDomain(admin);
        await repository.create(model);
        let result = await repository.find(expectedId);
        expect(result).toBeDefined();
        expect(result.getBirthday()).toEqual(model.birthday);
        expect(result.getRole()).toEqual(model.role)
        expect(result.getId()).toEqual(model.id)
    });


    it('should find all workers entity in the database', async () => {
        let worker1 = mockWorker({ role: RoleEnum.ADMINISTRATOR });
        let model = WorkerMapper.fromDomain(worker1);
        let worker2 = mockWorker({ role: RoleEnum.TEACHER });
        let model2 = WorkerMapper.fromDomain(worker2);
        await repository.create(model);
        await repository.create(model2);
        let results = await repository.findAll();
        expect(results.length).toBe(2);
        expect(results[0].getId()).toEqual(model.id)
        expect(results[0].getRole()).toEqual(model.role)
        expect(results[1].getId()).toEqual(model2.id)
        expect(results[1].getRole()).toEqual(model2.role)
    });

    it('should udpate a workers entity in the database', async () => {
        const expectedId = '27543f8f-11bd-464c-96af-c7cb09adeccf';
        const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR, id: expectedId });
        let model = WorkerMapper.fromDomain(admin);
        let worker2 = mockWorker();
        let model2 = WorkerMapper.fromDomain(worker2);
        await repository.create(model);
        expect(await repository.update(model2)).toBe(void 0);
        let result = await repository.find(expectedId);
        expect(result).toBeDefined()
        //expect(result).toStrictEqual(model2)
    });

    it('should find teacher entity by name', async () => {
        let worker = mockWorker();
        let model = WorkerMapper.fromDomain(worker);
        expect(await repository.create(model)).toBeInstanceOf(Worker);
        let entity = await repository.findByName(model.fullName);
        expect(entity).toBeDefined();
        expect(entity.getId()).toEqual(model.id);
        expect(entity.getRole()).toEqual(model.role);
    });

    it('should throw a QueryFailedError while saving a Worker', async () => {
        const entity = new WorkerEntity();
        await expect(repository.create(entity)).rejects.toThrow(QueryFailedError);
    });

});
