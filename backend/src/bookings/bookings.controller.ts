import { Controller, Post, Body, UseGuards, Request, Get, Param, Query, UnauthorizedException, Patch, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // ย้าย check มาไว้ก่อน :id ถูกต้องแล้วครับ
  @Get('check')
  async checkAvailability(
    @Query('fieldId') fieldId: any,
    @Query('date') date: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const numericFieldId = Number(fieldId); 
    if (!fieldId || isNaN(numericFieldId)) {
      throw new BadRequestException('ID ของการจองต้องเป็นตัวเลขเท่านั้น');
    }
    return this.bookingsService.checkAvailability(numericFieldId, date, start, end);
  }

  // NOTE: moved `findOne` below specific routes to avoid ':id' matching static paths like 'my-bookings'

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    // *** จุดสำคัญ: ใช้ req.user.id (ตามที่เซ็ตใน JwtStrategy validate) ***
    console.log("User creating booking:", req.user);
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getMyBookings(@Request() req) {
    console.log('[BookingsController] getMyBookings req.user =', req.user);
    return this.bookingsService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async getAllForAdmin(@Request() req) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException();
    return this.bookingsService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException();
    return this.bookingsService.updateStatus(+id, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      throw new BadRequestException('ID ของการจองต้องเป็นตัวเลขเท่านั้น');
    }
    return this.bookingsService.findOne(bookingId);
  }
}