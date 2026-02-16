import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';
import { filesService } from 'src/files/file.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Barber])
  ],
  controllers: [BarbersController],
  providers: [BarbersService, filesService],
  exports: [BarbersService],
})
export class BarbersModule {}
