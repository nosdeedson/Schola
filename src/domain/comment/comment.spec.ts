import { Comment } from "./comment"

describe('Comment unit tests', () => {

    it('should instantiate a comment without errors', () => {
        let comment = new Comment("comment", 'name who has done');
        expect(comment).toBeDefined();
        expect(comment.getCreatedAt()).toBeDefined();
        expect(comment.getUpdatedAt()).toBeDefined();
        expect(comment.getDeletedAt()).toBeUndefined();
        expect(comment.getId()).toBeDefined();

    })

    it('should have an error if comment is empty', () => {
        let comment: any;
        let namePersonHaveDone = 'name who has done';
        let entity = new Comment(comment, namePersonHaveDone);
        expect(entity.notification?.getErrors().length).toBe(1);
        expect(entity.notification?.messages()).toBe("comment: add a comment,")
    })

    it('should have an error if idPersonHadDone is not defined', () => {
        let comment = 'comment';
        let namePersonHaveDone: any;
        let entity = new Comment(comment, namePersonHaveDone);
        expect(entity.notification?.getErrors().length).toBe(1);
        expect(entity.notification?.messages()).toBe("comment: name of person has done is requered,")
    })

    it('should get a comment', () => {
        let comment = new Comment("comment", 'name who has done');
        expect(comment).toBeDefined();
        let resullt = comment.getComment()
        expect(resullt).toBe('comment');
    })

    it('should get id person had done the comment', () => {
        let comment = new Comment("comment", 'name who has done');
        expect(comment).toBeDefined();
        let resullt = comment.getNamePersonHaveDone()
        expect(resullt).toBe('name who has done');
    })

    it('should get date of the comment', () => {
        let comment = new Comment("comment", 'name who has done');
        expect(comment).toBeDefined();
        expect(comment.getCreatedAt()).toBeDefined();
    })

})
