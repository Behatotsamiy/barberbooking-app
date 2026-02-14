import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Not, Repository } from 'typeorm';
import { Barber } from 'src/barbers/entities/barber.entity';
import { Client } from 'src/clients/entities/client.entity';
import { CreateBarberDto } from 'src/barbers/dto/create-barber.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,

    @InjectRepository(Barber)
    private barbersRepository: Repository<Barber>,

    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}
  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const barber = await this.barbersRepository.findOneBy({
      id: createAppointmentDto.barber_id,
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    const client = await this.clientsRepository.findOneBy({
      id: createAppointmentDto.client_id,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const appointmentTime = new Date(createAppointmentDto.appointment_time);

    // 1. Проверка: время должно быть ровно началом часа (00 минут, 00 секунд)
    if (
      appointmentTime.getMinutes() !== 0 ||
      appointmentTime.getSeconds() !== 0
    ) {
      throw new BadRequestException(
        'Appointments must start at the beginning of the hour (e.g., 11:00, 12:00)',
      );
    }

    // 2. Ищем конфликт
    const isBusy = await this.appointmentsRepository.findOne({
      where: {
        barber_id: barber,
        appointment_time: appointmentTime,
        // Проверяем только активные записи (не отмененные)
        status: Not(AppointmentStatus.CANCELLED),
      },
    });

    if (isBusy) {
      throw new ConflictException('This hourly slot is already taken');
    }
    const appointment = this.appointmentsRepository.create({
      barber_id: barber, // Тут должен быть объект Barber
      client_id: client, // Тут должен быть объект Client
      appointment_time: createAppointmentDto.appointment_time,
      client_name: createAppointmentDto.client_name,
      client_phone_number: createAppointmentDto.client_phone_number,
      status: createAppointmentDto.status,
    });
    return await this.appointmentsRepository.save(appointment);
  }

  findAll() {
    const appointments = this.appointmentsRepository.find({
      relations: ['barber_id', 'client_id'], // Загружаем связанные сущности
    });
    return appointments;
  }

  findOne(id: number) {
    const appointment = this.appointmentsRepository.findOne({
      where: { id: id.toString() },
      relations: ['barber_id', 'client_id'], // Загружаем связанные сущности
    });
    return appointment;
  }

  async updateAppointment(id: string, dto: UpdateAppointmentDto) {
    // 1. Ищем саму запись (вместе с текущим мастером)
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['barber_id'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // 2. Если в обновлении есть НОВОЕ ВРЕМЯ или НОВЫЙ БАРБЕР
    if (dto.appointment_time || dto.barber_id) {
      const newTime = dto.appointment_time
        ? new Date(dto.appointment_time)
        : appointment.appointment_time;
      const newBarberId = dto.barber_id || appointment.barber_id.id;

      // Проверка на начало часа (если время меняется)
      if (
        dto.appointment_time &&
        (newTime.getMinutes() !== 0 || newTime.getSeconds() !== 0)
      ) {
        throw new BadRequestException(
          'New time must be at the beginning of the hour',
        );
      }

      // ПРОВЕРКА КОНФЛИКТА: ищем чужие записи на это время
      const isSlotBusy = await this.appointmentsRepository.findOne({
        where: {
          id: Not(id), // ИГНОРИРУЕМ текущую запись
          barber_id: { id: newBarberId },
          appointment_time: newTime,
          status: Not(AppointmentStatus.CANCELLED),
        },
      });

      if (isSlotBusy) {
        throw new ConflictException(
          'The new time slot is already booked for this barber',
        );
      }
    }

    // 3. Если меняется барбер — находим новый объект мастера
    if (dto.barber_id && dto.barber_id !== appointment.barber_id.id) {
      const newBarber = await this.barbersRepository.findOneBy({
        id: dto.barber_id,
      });
      if (!newBarber) throw new NotFoundException('New barber not found');
      appointment.barber_id = newBarber;
    }

    // 4. Если меняется клиент
    if (dto.client_id) {
      const newClient = await this.clientsRepository.findOneBy({
        id: dto.client_id,
      });
      if (!newClient) throw new NotFoundException('New client not found');
      appointment.client_id = newClient;
    }

    const { barber_id, client_id, ...restOfDto } = dto;
    // 5. Сливаем остальные данные (имя, телефон, статус, время)
    // merge обновит поля в объекте appointment данными из dto
    this.appointmentsRepository.merge(appointment, restOfDto);

    // 6. Сохраняем обновленную сущность
    return await this.appointmentsRepository.save(appointment);
  }

  remove(id: number) {
    const existingAppointment = this.appointmentsRepository.findOne({
      where: { id: id.toString() },
    });
    if (!existingAppointment) {
      throw new NotFoundException('Appointment not found');
    }
    const appointment = this.appointmentsRepository.findOne({
      where: { id: id.toString() },
    });
    this.appointmentsRepository.delete(id);
    return { deleted: true, appointment };
  }
}
