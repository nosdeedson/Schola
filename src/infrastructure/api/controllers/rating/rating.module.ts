import { Module } from '@nestjs/common';
import { ratingsProviders } from './providers/ratings.providers';
import { RatingController } from './rating.controller';

@Module({
    controllers: [RatingController],
    imports: [],
    providers: [...ratingsProviders],
})
export class RatingModule { }
