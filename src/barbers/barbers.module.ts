import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Barber])
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}
