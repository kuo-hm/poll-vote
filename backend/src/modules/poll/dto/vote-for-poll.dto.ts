import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoteForPollRequestDto {
  @ApiProperty({
    example: 'poll_id',
  })
  @IsString()
  @IsNotEmpty()
  pollId: string;

  @ApiProperty({
    example: 'option_id',
  })
  @IsString()
  @IsNotEmpty()
  optionId: string;
}
