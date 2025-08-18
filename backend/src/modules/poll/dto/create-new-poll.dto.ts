import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePollRequestDto {
  @ApiProperty({
    example: 'Poll Title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Poll Time To live IN MS',
    example: 6000,
    required: true,
  })
  @IsNumber()
  @Min(600)
  @IsNotEmpty()
  ttlInMs: number;

  @ApiProperty({
    example: 'Poll description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: [String],
    example: ['Option 1', 'Option 2'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(2)
  options: string[];
}
