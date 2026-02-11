import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Создаем перечисление для статусов, чтобы не было опечаток
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ type: 'uuid' })
  barber_id: string;

  @Column({ type: 'uuid', nullable: false })
  client_id: string; 

  @Column({ type: 'varchar', length: 100 })
  client_name: string;

  @Column({ type: 'varchar', length: 20 })
  client_phone_number: string;

  @Column({ type: 'timestamp' })
  appointment_time: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
