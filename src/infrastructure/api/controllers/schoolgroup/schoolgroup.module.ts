import { Module } from '@nestjs/common';
import { SchoolgroupController } from './schoolgroup.controller';
import { providers } from './providers/schoolgroups.providers';

@Module({
    controllers: [
        SchoolgroupController,
    ],
    providers: [...providers],
    imports: []
})
export class SchoolgroupModule { }
