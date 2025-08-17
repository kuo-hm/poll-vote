import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePollUseCase,
  PollEventsUseCase,
  VoteEvent,
  VoteForPollUseCase,
  GetPollsUseCase,
  GetPollStatsUseCase,
  GetPollByIdUseCase,
} from './usecase';
import { CreatePollRequestDto, VoteForPollRequestDto, GetPollsRequestDto } from './dto';
import { RequireXForwardedForGuard } from '../../common/guard';
import { GetVoterIp } from '../../common/decorator';
import { filter, map, Observable } from 'rxjs';

@Controller('poll')
export class PollController {
  constructor(
    private readonly createPollUseCase: CreatePollUseCase,
    private readonly voteForPollUseCase: VoteForPollUseCase,
    private readonly pollEventsUseCase: PollEventsUseCase,
    private readonly getPollsUseCase: GetPollsUseCase,
    private readonly getPollStatsUseCase: GetPollStatsUseCase,
    private readonly getPollByIdUseCase: GetPollByIdUseCase,
  ) {}
  @Post()
  async createPoll(@Body() body: CreatePollRequestDto) {
    return await this.createPollUseCase.execute(body);
  }

  @Post(':pollId/vote/:optionId')
  @UseGuards(RequireXForwardedForGuard)
  async vote(@Param() param: VoteForPollRequestDto, @GetVoterIp() ip: string) {
    await this.voteForPollUseCase.execute({
      ...param,
      voterIp: ip,
    });
  }

  @Get()
  @UseGuards(RequireXForwardedForGuard)
  async getActivePolls(
    @Query() query: GetPollsRequestDto,
    @GetVoterIp() ip: string,
  ) {
    return this.getPollsUseCase.execute({
      page: query.page,
      voterIp: ip,
      isActive: query.isActive,
    });
  }

  @Get('stats')
  async getPollStats() {
    return this.getPollStatsUseCase.execute();
  }

  @Get(':pollId')
  @UseGuards(RequireXForwardedForGuard)
  async getPollById(
    @Param('pollId') pollId: string,
    @GetVoterIp() ip: string,
  ) {
    return this.getPollByIdUseCase.execute({
      pollId,
      voterIp: ip,
    });
  }

  @Get(':pollId/stream')
  @Sse()
  voteStream(@Param('pollId') pollId: string): Observable<MessageEvent> {
    return this.pollEventsUseCase.getVoteStream().pipe(
      filter((event: VoteEvent) => event.pollId === pollId),
      map(
        (event: VoteEvent) =>
          ({
            data: event,
          }) as MessageEvent,
      ),
    );
  }
}
