import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อผู้ใช้งาน' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;
}