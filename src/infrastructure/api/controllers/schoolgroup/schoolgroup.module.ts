import { Module } from '@nestjs/common';
import { SchoolgroupController } from './schoolgroup.controller';
import { schoolgroupsProviders } from './providers/schoolgroups.providers';

@Module({
    controllers: [
        SchoolgroupController,
    ],
    providers: [...schoolgroupsProviders],
    imports: []
})
export class SchoolgroupModule { }
