import { Grade } from "../enum/grade/grade";
import { Student } from "../student/student";
import { Rating } from "./rating";
import { Comment } from "../comment/comment"
import { mockQuarter } from "../../../tests/mocks/domains/quarter.mocks";


describe('Rating unit tests', () => {

    let student: Student;
    beforeEach(() => {
        student = new Student({
            birthday: new Date(),
            name: 'jose',
            enrolled: '123',
            nameParents: ['maria']
        });
    })

    it('should instantiate a rating without errors', () => {
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        expect(rating.notification?.getErrors().length).toBe(0);
        expect(rating.getId()).toBeDefined();
        expect(rating.getCreatedAt()).toBeDefined();
        expect(rating.getUpdatedAt()).toBeDefined();
        expect(rating.getDeletedAt()).toBeUndefined();
    });

    it('notification should inform quarter not defined', () => {
        let quarter;
        const rating = new Rating(
            quarter as any,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: quarter of rating must be informed,')
    })

    it('notification should inform student not defined', () => {
        let student;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student as any,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: student receiving rating must be informed,')
    })

    it('notification should inform dateRating not defined', () => {
        let date;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            date as any,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: rating date must be informed,')
    })

    it('notification should inform listing not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            grade as any,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the listining skill must be informed,')
    })

    it('notification should inform writing not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            grade as any,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the writing skill must be informed,')
    })

    it('notification should inform reading not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            grade as any,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the reading skill must be informed,')
    })

    it('notification should inform speaking not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            grade as any,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the speaking skill must be informed,')
    })

    it('notification should inform grammar not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            grade as any,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the grammar skill must be informed,')
    })

    it('notification should inform homework not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            grade as any,
            Grade.BAD,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the homework commitment must be informed,')
    })

    it('notification should inform homework not defined', () => {
        let grade;
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            grade as any,
        );
        expect(rating.notification?.getErrors().length).toBe(1);
        expect(rating.notification?.messages()).toBe('rating: the vocabulary improvment must be informed,')
    })

    it('should have at leat one comment', () => {
        let comment = new Comment("comment", '123');
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        rating.setComments(comment)
        expect(rating).toBeDefined();
        expect(rating.getComments().length).toBe(1)

    });

    it('should get a comment', () => {
        let comment = new Comment("comment", '123');
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        rating.setComments(comment)
        expect(rating).toBeDefined();
        expect(rating.getComments().length).toBe(1);
        const result = rating.getComments()[0]
        expect(result).toEqual(comment)
    });

    it('should get the quarter', () => {
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getQuarter()
        expect(result).toEqual(quarter)
    });

    it('should get the quarter', () => {
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getStudent()
        expect(result).toEqual(student)
    });

    it('should get the student', () => {
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            new Date(),
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getStudent()
        expect(result).toEqual(student)
    });

    it('should get the date rating', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getRatingDate()
        expect(result).toEqual(dateRating)
    });

    it('should get the listining skill', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getListing()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the writing skill', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getWriting()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the reading skill', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getReading()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the speaking skill', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getSpeaking()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the grammar skill', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getGrammar()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the homework commitment', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getHomework()
        expect(result).toEqual(Grade.BAD)
    });

    it('should get the vocabulary improvment', () => {
        let dateRating = new Date();
        const quarter = mockQuarter();
        const rating = new Rating(
            quarter,
            student,
            dateRating,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        expect(rating).toBeDefined();
        const result = rating.getVocabulary()
        expect(result).toEqual(Grade.BAD)
    });
})