import { Module } from '@nestjs/common';
import { PollController } from './poll.controller';
import { PollRepository } from './repository/poll.repository';
import { CreatePollUseCase } from './usecase/create-poll.usecase';
import { PollSchedulerUseCase, VoteForPollUseCase, GetPollsUseCase, PollEventsUseCase, GetPollStatsUseCase, GetPollByIdUseCase } from './usecase';

@Module({
  controllers: [PollController],
  providers: [
    CreatePollUseCase,
    PollRepository,
    PollSchedulerUseCase,
    VoteForPollUseCase,
    GetPollsUseCase,
    PollEventsUseCase,
    GetPollStatsUseCase,
    GetPollByIdUseCase,
  ],
})
export class PollModule {}
