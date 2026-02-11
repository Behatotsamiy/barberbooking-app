import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  barber_id: string;

  @Column({
    type: 'uuid',
  })
  client_id: string;

  @Column({
    type: 'uuid',
  })
  appointment_id: string;

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
