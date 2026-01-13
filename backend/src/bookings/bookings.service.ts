import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
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
    const { fieldId, bookingDate, startTime, endTime } = createBookingDto;
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
      throw new BadRequestException('สนามนี้ถูกจองแล้วในช่วงเวลาดังกล่าว');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user: { id: numericUserId },
      field: { id: fieldId },
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll() {
    return this.bookingRepository.find({ relations: ['user', 'field'] });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['user', 'field'] });
    if (!booking) throw new NotFoundException('ไม่พบรายการจอง');
    return booking;
  }

  async checkAvailability(fieldId: number, date: string, start: string, end: string) {
    const conflict = await this.bookingRepository.findOne({
      where: {
        field: { id: fieldId },
        bookingDate: date,
        status: Not('CANCELLED'),
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });
    return { available: !conflict }; 
  }

  async findByUserId(userId: number) {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['field'],
      order: { bookingDate: 'DESC', startTime: 'DESC' },
    });
  }

  async cancelByUser(bookingId: number, userId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) throw new NotFoundException('ไม่พบรายการจอง');
    if (booking.user.id !== userId) throw new UnauthorizedException('คุณไม่มีสิทธิ์ยกเลิกรายการนี้');
    if (booking.status !== 'PENDING') throw new BadRequestException('ยกเลิกได้เฉพาะรายการที่รอดำเนินการเท่านั้น');

    booking.status = 'CANCELLED';
    return await this.bookingRepository.save(booking);
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

  async remove(id: number) {
    const booking = await this.findOne(id); 
    return await this.bookingRepository.remove(booking);
  }
}