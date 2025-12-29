import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field} from './entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Field])], // นำเข้า Entity เข้าไปในระบบ TypeORM
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService], // ❗ สำคัญ: ต้อง Export เพื่อให้ BookingModule เรียกใช้งานได้
})
export class FieldsModule {}
