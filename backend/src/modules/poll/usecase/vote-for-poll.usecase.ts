import { ConflictException, Injectable } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';
import { PollEventsUseCase } from './poll-event.usecase';

@Injectable()
export class VoteForPollUseCase {
  constructor(
    private readonly repository: PollRepository,
    private readonly pollEventsUseCase: PollEventsUseCase,
  ) {}
  
  async execute(payload: Payload): Promise<void> {
    const alreadyVoted = await this.repository.alreadyVoted(
      payload.pollId,
      payload.voterIp,
    );
    if (alreadyVoted === true) {
      throw new ConflictException('You already Voted for this poll');
    }

    await this.repository.vote(payload);
    
    const poll = await this.repository.getPollById(payload.pollId);
    if (!poll) {
      return;
    }
    
    const votedOption = poll.options.find(option => option.id === payload.optionId);
    if (!votedOption) {
      return;
    }
    
    this.pollEventsUseCase.emitVote({
      type: 'vote',
      pollId: payload.pollId,
      optionId: payload.optionId,
      votes: votedOption.votes,
    });

    this.pollEventsUseCase.emitPollUpdate({
      type: 'poll_update',
      pollId: payload.pollId,
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description ?? undefined,
        createdAt: poll.createdAt,
        isActive: poll.isActive,
        ttlInMs: poll.ttlInMs,
        totalVotes: poll._count.votes,
        options: poll.options.map(option => ({
          id: option.id,
          text: option.text,
          votes: option.votes,
        })),
        userVote: null, // We don't send user vote in updates to avoid exposing other users' votes
      },
    });
  }
}

interface Payload {
  pollId: string;
  optionId: string;
  voterIp: string;
}
