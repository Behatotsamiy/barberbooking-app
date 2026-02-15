import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Barber } from 'src/barbers/entities/barber.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Barber, Client, Appointment])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
