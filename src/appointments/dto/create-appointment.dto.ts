import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';
import { AppointmentStatus } from '../entities/appointment.entity';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  barber_id: string;

  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsString()
  @IsNotEmpty()
  client_phone_number: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  appointment_time: Date;

  @IsEnum(AppointmentStatus, {
    message: `Status must be one of the following: ${Object.values(AppointmentStatus).join(', ')}`,
  })
  status: AppointmentStatus;
}
