import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException ,Request } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createField(@Body() data: any, @Request() req: any) { 
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('เฉพาะ Admin เท่านั้น');
    return this.fieldsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteField(@Param('id') id: string, @Request() req: any) { 
    if (req.user.role !== 'ADMIN') throw new UnauthorizedException('เฉพาะ Admin เท่านั้น');
    return this.fieldsService.remove(+id);
  }

  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(+id);
  }

  @Post()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldsService.remove(+id);
  }

}
