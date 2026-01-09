import { Injectable } from '@nestjs/common';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './entities/field.entity';  

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

  // เพิ่มฟังก์ชันสร้างและลบ
async create(data: any) {
  const newField = this.fieldsRepository.create(data);
  return await this.fieldsRepository.save(newField);
}

async remove(id: number) {
  return await this.fieldsRepository.delete(id);
}
  async findAll() {
  return await this.fieldsRepository.find(); 
}

  findOne(id: number) {
    return `This action returns a #${id} field`;
  }

  update(id: number, updateFieldDto: UpdateFieldDto) {
    return `This action updates a #${id} field`;
  }

}
