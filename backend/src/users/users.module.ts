import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // นำเข้า Entity เข้าไปในระบบ TypeORM
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // ❗ สำคัญ: ต้อง Export เพื่อให้ AuthModule เรียกใช้งานได้
})
export class UsersModule {}