import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const DATA_SOURCE = 'DATA_SOURCE';

@Global()
@Module({
    providers:[
        {
            provide: DATA_SOURCE,
            useFactory: async () =>{
                const dataSource = new DataSource({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: process.env.POSTGRES_USER_NAME,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.DATABASE_NAME,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: true,
                  });
                  return dataSource.initialize();
            }
        }
    ],
    exports: [DATA_SOURCE],
    imports: [ ]
})
export class DataBaseConnectionModule {}
