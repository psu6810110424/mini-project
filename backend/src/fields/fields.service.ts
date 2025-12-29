import { Injectable } from '@nestjs/common';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './entities/field.entity';  
import { CreateFieldDto } from './dto/create-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

 async create(createFieldDto: any) {
    const newField = this.fieldsRepository.create(createFieldDto);
    return await this.fieldsRepository.save(newField); 
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

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}
