import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  test('should be able to delete a question comment', async () => {
    const question = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(question);

    await sut.execute({
      questionCommentId: question.id.toString(),
      authorId: question.authorId.toString()
    });
  
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  test('should not be able to delete another user question comment', async () => {
    const question = makeQuestionComment({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryQuestionCommentsRepository.create(question);

    const result = await sut.execute({
      questionCommentId: question.id.toString(),
      authorId: 'author-2'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

