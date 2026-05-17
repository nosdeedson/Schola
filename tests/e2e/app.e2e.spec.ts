import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/infrastructure/api/controllers/app/AppModule';
import { setEnv } from '../mocks/env/env.mock';
import { DATA_SOURCE, DataBaseConnectionModule } from '../../src/infrastructure/data-base-connection/data-base-connection.module';
import { TestDataSource } from '../../src/infrastructure/repositories/config-test/test.datasource';
import { createE2EConfing } from './create.e2e.confing';

describe('App E2E', () => {
    let app: INestApplication;

    beforeAll(async () => {
        setEnv();
        app = await createE2EConfing([AppModule], [])
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /', async () => {
        const response = await request(app.getHttpServer())
            .get('/');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.text).toBe("hello world!! schola")
    });
});
