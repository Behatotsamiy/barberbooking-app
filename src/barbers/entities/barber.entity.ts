import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 7,
  })
  phone_number: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Barber lokatsiyasi',
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Barber bio',
  })
  bio: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  rating: number;

  @Column({default: 0})
  reviewCount: number;

  @Column({
    type:'text',
    array: true,
    nullable: true,
  })
  picture: string[];

  @Column({  })
  price: number;

  @OneToMany(() => Appointment, (appointment) => appointment.barber_id)
  appointments: Appointment[];
  @OneToMany(() => Feedback, (feedback) => feedback.barber_id)
  feedbacks: Feedback[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
