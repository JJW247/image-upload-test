import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imageService.createImage(files);
  }

  @Get()
  async getImages() {
    return await this.imageService.getImages();
  }
}
