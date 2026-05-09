import { Module } from '@nestjs/common';
import { providers } from './providers/ratings.providers';
import { RatingController } from './rating.controller';

@Module({
    controllers: [RatingController],
    imports: [],
    providers: [...providers],
})
export class RatingModule { }
