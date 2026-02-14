import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Barber } from 'src/barbers/entities/barber.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Appointment, Barber, Client])
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
