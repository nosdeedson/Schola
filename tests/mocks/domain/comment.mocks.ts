import { Comment } from '../../../src/domain/comment/comment';


type CommentMock = {
    comment?: string;
    namePersoHaveDone?: string;
}

export function mockComment(
    overrides: CommentMock = {}
): Comment {
    return new Comment(
        overrides.comment ?? "just a comment",
        overrides.namePersoHaveDone ?? "1213"
    );
}
