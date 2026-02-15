import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { Barber } from 'src/barbers/entities/barber.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Barber)
    private barbersRepository: Repository<Barber>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>
  ){}
 async create(createFeedbackDto: CreateFeedbackDto) {
    const barber = await this.barbersRepository.findOneBy({
      id: createFeedbackDto.barber_id,
    })
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    const client = await this.clientsRepository.findOneBy({
      id: createFeedbackDto.client_id,
    })
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const appointment = await this.appointmentsRepository.findOneBy({
      id: createFeedbackDto.appointment_id,
    })  
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const feedback = this.feedbackRepository.create({
      barber_id: barber,
      client_id: client,
      appointment_id: appointment,
      description: createFeedbackDto.description,
      given_stars: createFeedbackDto.given_stars,
    });
    return this.feedbackRepository.save(feedback);
  }

  findAll() {
    const feedbacks = this.feedbackRepository.find();
    return feedbacks;
  }

  findOne(id: number) {
    const feedback = this.feedbackRepository.findOne({ where: { id: id.toString() } });
    return feedback;
  }
    

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
      const feedback = this.feedbackRepository.findOne({ where: { id: id.toString() } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
