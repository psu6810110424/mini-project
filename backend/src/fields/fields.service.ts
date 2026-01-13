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

  async update(id: number, updateFieldDto: UpdateFieldDto) {
    await this.fieldsRepository.update(id, updateFieldDto);
    return await this.fieldsRepository.findOneBy({ id });
  }
}