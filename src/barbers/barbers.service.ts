import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private barbersRepository: Repository<Barber>,
  ) {}
  async createBarber(createBarberDto: CreateBarberDto): Promise<Barber> {
    const existingUser = await this.barbersRepository.findOne({
      where: { phone_number: createBarberDto.phone_number },
    });
    if (existingUser) {
      throw new ConflictException('Phone number already in use');
    }
    const barber = this.barbersRepository.create(createBarberDto);
    return this.barbersRepository.save(barber);
  }

  findAll() {
    const barbers = this.barbersRepository.find();
    return barbers;
  }

  findOne(id: number) {
    const barber = this.barbersRepository.findOne({ where: { id: id.toString() } });
    return barber;
  }

  update(id: number, updateBarberDto: UpdateBarberDto) {
    const existingUser = this.barbersRepository.findOne({
      where: { phone_number: updateBarberDto.phone_number },
    });
    if (!existingUser) {
      throw new ConflictException('Phone number is not defined');
    }
    const barber = this.barbersRepository.findOne({ where: { id: id.toString() } });
    this.barbersRepository.update(id, updateBarberDto);
    return barber;
  }

  remove(id: number) {
    const existingUser = this.barbersRepository.findOne({
      where: { id: id.toString() },
    });
    if (!existingUser) {
      throw new ConflictException('Barber not found');
    }
    const barber = this.barbersRepository.findOne({ where: { id: id.toString() } });
    this.barbersRepository.delete(id);
    return { deleted: true, barber };
  }
}