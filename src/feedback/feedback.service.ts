import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private appointmentsRepository: Repository<Appointment>,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    const barber = await this.barbersRepository.findOneBy({
      id: createFeedbackDto.barber_id,
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    const client = await this.clientsRepository.findOneBy({
      id: createFeedbackDto.client_id,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const appointment = await this.appointmentsRepository.findOneBy({
      id: createFeedbackDto.appointment_id,
    });
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
    const savedFeedback = await this.feedbackRepository.save(feedback);
    await this.updateBarberRating(barber.id);
    return savedFeedback;
  }

  findAll() {
    const feedbacks = this.feedbackRepository.find();
    return feedbacks;
  }

  async findOne(id: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['barber_id', 'client_id', 'appointment_id'], // Подгружаем всё, чтобы фронтенд красиво всё отрисовал
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto, user: any) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: id.toString() },
      relations: ['client_id'],
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    const isAdmin = user.role === 'admin'; // Проверь, как у тебя называется роль
    const isOwner = feedback.client_id === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own feedbacks');
    }
    if (updateFeedbackDto.description !== undefined)
      feedback.description = updateFeedbackDto.description;
    if (updateFeedbackDto.given_stars !== undefined)
      feedback.given_stars = updateFeedbackDto.given_stars;

    const updatedFeedback = await this.feedbackRepository.save(feedback);
    await this.updateBarberRating(feedback.barber_id.id);
    return updatedFeedback;
  }

  async remove(id: string) {
    const existingFeedback = await this.feedbackRepository.findOne({
      where: { id: id.toString() },
    });
    if (!existingFeedback) {
      throw new NotFoundException('Feedback not found');
    }
    const barberId = existingFeedback.barber_id.id; // Запоминаем ID барбера

    await this.feedbackRepository.remove(existingFeedback); // Удаляем

    // ВЫЗОВ ПЕРЕСЧЕТА (уже без этого отзыва)
    await this.updateBarberRating(barberId);

    return { deleted: true };
  }

  private async updateBarberRating(barberId: string) {
    // 1. Получаем все оценки этого барбера
    const feedbacks = await this.feedbackRepository.find({
      where: { barber_id: { id: barberId } },
    });

    const reviewCount = feedbacks.length;

    // 2. Считаем среднее
    const averageRating =
      reviewCount > 0
        ? feedbacks.reduce((sum, fb) => sum + fb.given_stars, 0) / reviewCount
        : 0;

    // 3. Сохраняем результат в таблицу барберов
    await this.barbersRepository.update(barberId, {
      rating: Number(averageRating.toFixed(2)),
      reviewCount: reviewCount,
    });
  }
}
