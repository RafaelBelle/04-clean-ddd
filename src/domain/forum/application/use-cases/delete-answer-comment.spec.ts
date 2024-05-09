import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  test('should be able to delete a answer comment', async () => {
    const answer = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answer);

    await sut.execute({
      answerCommentId: answer.id.toString(),
      authorId: answer.authorId.toString()
    });
  
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  test('should not be able to delete another user answer comment', async () => {
    const answer = makeAnswerComment({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswerCommentsRepository.create(answer);

    const result = await sut.execute({
      answerCommentId: answer.id.toString(),
      authorId: 'author-2'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

