import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { filesService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class filesController {
  constructor(private readonly filesService: filesService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadToImgBB(file);
  }
}
