import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan, MoreThan } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: any) {
    const { fieldId, bookingDate, startTime, endTime, totalPrice } = createBookingDto; // Include totalPrice
    const numericUserId = Number(userId);

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
      user: { id: numericUserId }, // Ensure user relationship is included
    });

    return await this.bookingRepository.save(booking); // Save the booking
  }

  async findAll() {
    return this.bookingRepository.find({ relations: ['user', 'field'] });
  }

  async findOne(id: number) {
    return this.bookingRepository.findOne({ where: { id }, relations: ['user', 'field'] });
  }

  async checkAvailability(fieldId: number, date: string, start: string, end: string) {
    // ลองใส่ console.log เพื่อดูว่า Backend ได้รับเลขอะไร
    console.log('Backend received fieldId:', fieldId);

    const conflict = await this.bookingRepository.findOne({
      where: {
        field: { id: fieldId }, // fieldId ต้องเป็นเลข 1, 2 เท่านั้นตรงนี้
        bookingDate: date,
        status: Not('CANCELLED'),
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });

    return { available: !conflict };
  }

  async findByUserId(userId: number) {
    console.log('[BookingsService] findByUserId userId =', userId);
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['field'],
      order: { bookingDate: 'DESC', startTime: 'DESC' },
    });
  }

  async findAllAdmin() {
    return this.bookingRepository.find({
      relations: ['user', 'field'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string) {
    await this.bookingRepository.update(id, { status });
    return this.findOne(id);
  }
}