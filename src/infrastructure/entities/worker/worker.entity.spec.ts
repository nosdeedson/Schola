import { mockClass } from '../../../../tests/mocks/domain/class.mocks';
import { mockWorker } from '../../../../tests/mocks/domain/worker.mock';
import { RoleEnum } from '../../../domain/worker/roleEnum';
import { WorkerEntity } from './worker.entity';

describe('WokerModel', () => {
  let worker;
  let schooGroup;
  beforeEach(() => {
    worker = mockWorker();
    schooGroup = mockClass();
  })

  it('should be defined as a teacher', () => {
    let entity = WorkerEntity.toWorkerEntity(worker, schooGroup);
    expect(entity).toBeDefined();
    expect(entity.role).toEqual(RoleEnum.TEACHER);
    expect(entity.id).toEqual(worker.getId());
  });

  it('should return undefined', () => {
    expect(WorkerEntity.toWorkerEntity(null, schooGroup)).toBeUndefined();
  });
});
