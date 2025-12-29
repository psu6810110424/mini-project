import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FieldsModule } from './fields/fields.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. โหลดค่าจากไฟล์ .env
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. ตั้งค่า TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'my_project_db'),
        autoLoadEntities: true, // โหลด Entity อัตโนมัติ
        synchronize: true,      // พัฒนาอยู่ให้เป็น true (ห้ามใช้ใน Production!)
      }),
    }),
    
    UsersModule,
    
    FieldsModule,
    
    BookingsModule,
    
    AuthModule,
  ],
})
export class AppModule {}