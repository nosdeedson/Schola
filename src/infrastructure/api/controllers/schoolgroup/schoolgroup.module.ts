import { Module } from '@nestjs/common';
import { SchoolgroupController } from './schoolgroup.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { providers } from './providers/schoolgroups.providers';

@Module({
    controllers: [
        SchoolgroupController,
    ],
    providers: [...providers],
    imports: [DataBaseConnectionModule]
})
export class SchoolgroupModule { }
