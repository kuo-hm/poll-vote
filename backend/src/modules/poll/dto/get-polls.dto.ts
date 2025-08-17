import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { validateIntValue } from '../../../common/helpers/validators';

export class GetPollsRequestDto {
  @ApiPropertyOptional({ required: false, default: 1 })
  @IsNumber()
  @Transform(({ value }) => validateIntValue(value))
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ required: false, default: true, description: 'Filter by poll status' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isActive?: boolean;
}
