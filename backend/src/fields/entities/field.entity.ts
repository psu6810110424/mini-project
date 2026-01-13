import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Field {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
    @Column({ default: 'Football' }) 
  type: string; 

  @Column()
  pricePerHour: number;

  @OneToMany(() => Booking, (booking) => booking.field)
  bookings: Booking[];
}