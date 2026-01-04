import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }
  @Get('check')
  async checkAvailability(
    @Query('fieldId') fieldId: string,
    @Query('date') date: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.bookingsService.checkAvailability(+fieldId, date, start, end);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }
}

