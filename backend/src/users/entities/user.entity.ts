import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; 

  @Column({ default: 'USER' }) 
  role: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}