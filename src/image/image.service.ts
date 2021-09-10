import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async createImage(files: Array<Express.Multer.File>) {
    const image = await this.imageRepository.create({
      originalName: files[0].originalname,
      fileName: files[0].filename,
    });

    if (!image) {
      throw new HttpException(
        '이미지 업로드에 실패하였습니다!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.imageRepository.save(image);

    return { ok: true, image };
  }

  async getImages() {
    return this.imageRepository.find();
  }
}
