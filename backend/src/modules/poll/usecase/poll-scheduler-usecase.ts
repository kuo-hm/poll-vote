import { Injectable } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';

@Injectable()
export class PollSchedulerUseCase {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly repository: PollRepository) {}

  async execute(pollId: string, ttlInMs: number) {
    if (this.timeouts.has(pollId)) {
      clearTimeout(this.timeouts.get(pollId));
    }

    const timeout = setTimeout(async () => {
      await this.repository.expirePoll(pollId);
      console.log(`Poll ${pollId} expired`);
      this.timeouts.delete(pollId);
    }, ttlInMs);

    this.timeouts.set(pollId, timeout);
  }

  cancelPollExpiration(pollId: string) {
    if (this.timeouts.has(pollId)) {
      clearTimeout(this.timeouts.get(pollId));
      this.timeouts.delete(pollId);
    }
  }
}
