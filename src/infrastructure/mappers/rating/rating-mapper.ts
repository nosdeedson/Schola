import { Rating } from "@/domain/rating/rating";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { QuarterMapper } from "../semester/quarter-mapper";
import { StudentMapper } from "../student/student-mapper";
import { CommentMapper } from "../comment/comment-mapper";

export class RatingMapper {

    static fromEntity(entity: RatingEntity): Rating {
        if (!entity) return null;
        const student = entity?.student ? StudentMapper.fromEntity(entity.student) : null;
        const quarter = entity?.quarter ? QuarterMapper.fromEntity(entity.quarter) : null;
        const rating = new Rating(
            quarter,
            student,
            entity.ratingDate,
            entity.listing,
            entity.writing,
            entity.reading,
            entity.speaking,
            entity.grammar,
            entity.homework,
            entity.vocabulary,
            entity?.id,
            entity?.createdAt,
            entity?.updatedAt,
            entity?.deletedAt,
        );
        entity?.comments ? entity.comments.map(it => rating.setComments(CommentMapper.fromEntity(it))) : [];
        return rating;
    }

    static fromDomain(rating: Rating): RatingEntity {
        if(!rating) return null;
        let entity = new RatingEntity();
        entity.createdAt = rating.getCreatedAt();
        entity.deletedAt = rating.getDeletedAt();
        entity.grammar = rating.getGrammar();
        entity.homework = rating.getHomework();
        entity.id = rating.getId();
        entity.listing = rating.getListing();
        entity.ratingDate = rating.getRatingDate();
        entity.reading = rating.getReading();
        entity.speaking = rating.getSpeaking();
        entity.student = StudentMapper.fromDomain(rating.getStudent());
        entity.updatedAt = rating.getUpdatedAt();
        entity.vocabulary = rating.getVocabulary();
        entity.writing = rating.getWriting();
        entity.quarter = QuarterMapper.fromDomain(rating.getQuarter());
        return entity;
    }

    static toRatingsEntity(ratings: Rating[]): RatingEntity[] {
        if (!ratings) {
            return undefined
        }
        return ratings.map(it => this.fromDomain(it));
    }
}
