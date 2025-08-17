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
      pollId: payload.pollId,
      optionId: payload.optionId,
      votes: votedOption.votes,
    });
  }
}

interface Payload {
  pollId: string;
  optionId: string;
  voterIp: string;
}
