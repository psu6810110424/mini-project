import { IsNotEmpty, IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  fieldId: number;

  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number; // Added totalPrice
}