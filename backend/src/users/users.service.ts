import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
  ) {}
  
  async create(userData: Partial<User>) {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByUsername(username: string): Promise<User | null> { 
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
