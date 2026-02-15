import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  barber_id: string;
  @IsUUID()
  @IsNotEmpty()
  client_id: string;
  @IsUUID()
  @IsNotEmpty()
  appointment_id: string;
  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Description must be at most 500 characters' })
  description: string;
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  given_stars: number;
}
