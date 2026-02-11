import { Appointment } from 'src/appointments/entities/appointment.entity';
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
  id: number;

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
    type: 'varchar',
    length: 255,
  })
  rating: string;

  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments: Appointment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
