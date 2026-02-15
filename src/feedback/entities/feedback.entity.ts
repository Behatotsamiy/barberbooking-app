import { UUID } from 'crypto';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Barber } from 'src/barbers/entities/barber.entity';
import { Client } from 'src/clients/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Barber, (barber) => barber.feedbacks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barber_id' })
  barber_id: Barber;

  @ManyToOne(() => Client, (client) => client.feedbacks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client_id: Client;

 @ManyToOne(() => Appointment , { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment_id: Appointment;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'integer',
  })
  given_stars: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
