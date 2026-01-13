import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateFieldDto {

  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุชื่อสนาม' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'ราคาต้องไม่ต่ำกว่า 0 บาท' })
  pricePerHour: number;

  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุประเภทของสนาม' })
  type: string;
}

