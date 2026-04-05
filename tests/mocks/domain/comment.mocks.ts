import { Comment } from '../../../src/domain/comment/comment';


type CommentMock = {
    comment?: string;
    idPerson?: string;
}

export function mockComment(
    overrides: CommentMock = {}
): Comment {
    return new Comment(
        overrides.comment ?? "just a comment",
        overrides.idPerson ?? "1213"
    );
}
