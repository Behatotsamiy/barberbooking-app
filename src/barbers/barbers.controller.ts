import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { UserRole } from 'src/clients/entities/client.entity';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { filesService } from 'src/files/file.service';
import {  FilesInterceptor } from '@nestjs/platform-express';

@Controller('barbers')
export class BarbersController {
  constructor(
    private readonly barbersService: BarbersService,
    private readonly filesService: filesService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('pictures', 10))

  async create(@Body() createBarberDto: CreateBarberDto, @UploadedFile() files: Express.Multer.File[]) {
    let imageUrls : string[] | null = [];
if (files?.length) {
    imageUrls = await Promise.all(
      files.map((file) =>
        this.filesService.uploadToImgBB(file),
      ),
    );
  }
    return this.barbersService.createBarber(createBarberDto, imageUrls ? imageUrls[0] : null);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.barbersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barbersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarberDto: UpdateBarberDto) {
    return this.barbersService.update(+id, updateBarberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barbersService.remove(+id);
  }
}
