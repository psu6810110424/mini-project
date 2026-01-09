import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn ,JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ default: 'PENDING' }) 
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Field, (field) => field.bookings, { onDelete: 'CASCADE' }) 
  field: Field;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;
}