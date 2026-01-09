import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field} from './entities/field.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), AuthModule],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService], 
})
export class FieldsModule {}
