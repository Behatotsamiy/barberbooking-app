import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'string',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'string',
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
    type: 'string',
    length: 255,
    comment: 'Barber bio',
  })
  bio: string;

  @Column({
    type: 'string',
    length: 255,
  })
  rating: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
