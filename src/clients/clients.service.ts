import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}
  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const existingUser = await this.clientsRepository.findOne({
      where: { client_phonenumber: createClientDto.client_phonenumber },
    });
    if (existingUser) {
      throw new ConflictException('Phone number already in use');
    }
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  findAll() {
    const clients = this.clientsRepository.find();
    return clients;
  }

  findOne(id: number) {
    const client = this.clientsRepository.findOne({ where: { id: id.toString() } });
    return client;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    const existingUser = this.clientsRepository.findOne({
      where: { client_phonenumber: updateClientDto.client_phonenumber },
    });
    if (!existingUser) {
      throw new ConflictException('Phone number is not defined');
    }
    const client = this.clientsRepository.findOne({ where: { id: id.toString() } });
    this.clientsRepository.update(id, updateClientDto);
    return client;
  }

  remove(id: number) {
    const existingUser = this.clientsRepository.findOne({
      where: { id: id.toString() },
    });
    if (!existingUser) {
      throw new ConflictException('Client not found');
    }
    const client = this.clientsRepository.findOne({ where: { id: id.toString() } });
    this.clientsRepository.delete(id);
    return { deleted: true, client };
  }
}