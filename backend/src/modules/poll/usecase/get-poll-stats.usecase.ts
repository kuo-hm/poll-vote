import { Injectable } from '@nestjs/common';
import { PollRepository } from '../repository/poll.repository';

export interface PollStats {
  activePolls: number;
  totalVotes: number;
}

@Injectable()
export class GetPollStatsUseCase {
  constructor(private readonly pollRepository: PollRepository) {}

  async execute(): Promise<PollStats> {
    return this.pollRepository.getPollStats();
  }
}
