import { Injectable } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';
import { PollSchedulerUseCase } from './poll-scheduler-usecase';

@Injectable()
export class CreatePollUseCase {
  constructor(
    private readonly repository: PollRepository,
    private readonly pollSchedulerUseCase: PollSchedulerUseCase,
  ) {}
  
  async execute(payload: Payload): Promise<string> {
    const pollId = await this.repository.createPoll(payload);
    await this.pollSchedulerUseCase.execute(pollId, payload.ttlInMs);
    return pollId;
  }
}

interface Payload {
  title: string;
  description?: string;
  options: string[];
  ttlInMs: number;
}
