import { Worker } from "@/domain/worker/worker";
import { mockWorker } from "../../../../tests/mocks/domain/worker.mock";
import { WorkerMapper } from "./worker-mapper";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

describe('WorkerMapper', () => {
    it('should convert from worker entity to worker domain', () => {
        const entity = WorkerMapper.fromDomain(mockWorker());
        expect(WorkerMapper.fromEntity(entity)).toBeInstanceOf(Worker);
    });

    it('should convert worker domain to worker entity', () => {
        expect(WorkerMapper.fromDomain(mockWorker())).toBeInstanceOf(WorkerEntity);
    });
});
