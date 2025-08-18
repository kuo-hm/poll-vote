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
import {
  CreatePollRequestDto,
  VoteForPollRequestDto,
  GetPollsRequestDto,
} from './dto';
import { CaptureIpGuard } from '../../common/guard';
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
  @UseGuards(CaptureIpGuard)
  async vote(@Param() param: VoteForPollRequestDto, @GetVoterIp() ip: string) {
    await this.voteForPollUseCase.execute({
      ...param,
      voterIp: ip,
    });
  }

  @Get()
  @UseGuards(CaptureIpGuard)
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

  @Sse('stream')
  allPollsStream(): Observable<MessageEvent> {
    return this.pollEventsUseCase.getAllEvents().pipe(
      map(
        (event) =>
          ({
            data: event,
          }) as MessageEvent,
      ),
    );
  }

  @Get(':pollId')
  @UseGuards(CaptureIpGuard)
  async getPollById(@Param('pollId') pollId: string, @GetVoterIp() ip: string) {
    return this.getPollByIdUseCase.execute({
      pollId,
      voterIp: ip,
    });
  }

  @Get(':pollId/stream')
  @Sse()
  voteStream(@Param('pollId') pollId: string): Observable<MessageEvent> {
    return this.pollEventsUseCase.getAllEvents().pipe(
      filter((event) => event.pollId === pollId),
      map(
        (event) =>
          ({
            data: event,
          }) as MessageEvent,
      ),
    );
  }
}
