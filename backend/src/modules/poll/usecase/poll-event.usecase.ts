import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PollEventsUseCase {
  private voteSubject = new Subject<VoteEvent>();

  emitVote(payload: VoteEvent) {
    this.voteSubject.next(payload);
  }

  getVoteStream(): Observable<VoteEvent> {
    return this.voteSubject.asObservable();
  }
}
export interface VoteEvent {
  pollId: string;
  optionId: string;
  votes: number;
}
