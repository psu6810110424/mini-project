import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan, MoreThan, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { fieldId, bookingDate, startTime, endTime } = createBookingDto;

    const existingBooking = await this.bookingRepository.findOne({
      where: [
        {
          field: { id: fieldId },
          bookingDate,
          status: Not('CANCELLED'),
          startTime: LessThan(endTime),
          endTime: MoreThan(startTime),
        },
      ],
    });

    if (existingBooking) {
      throw new BadRequestException('สนามนี้ถูกจองแล้วในช่วงเวลาดังกล่าว กรุณาเลือกเวลาใหม่');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user: { id: userId } as any,
      field: { id: fieldId } as any,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll() {
  return this.bookingRepository.find({ relations: ['user', 'field'] });
 }

  async findOne(id: number) {
    return this.bookingRepository.findOne({ where: { id }, relations: ['user', 'field'] });
 }
  async checkAvailability(fieldId: number, date: string, start: string, end: string) {
  const conflict = await this.bookingRepository.findOne({
    where: [
      {
        field: { id: fieldId },
        bookingDate: date,
        status: Not('CANCELLED'),
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    ],
  });

  return { available: !conflict };
  }
}