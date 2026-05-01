import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction-service';
import { DataBaseConnectionModule } from '../data-base-connection/data-base-connection.module';
import { setEnv } from '../__mocks__/env.mock';

describe('TransactionServiceService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    setEnv();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
