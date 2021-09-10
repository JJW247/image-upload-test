import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ImageEntity } from './entities/image.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            callback(
              new HttpException(
                'jpg, jpeg, png 형식의 이미지 파일을 업로드해주세요!',
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
          callback(null, true);
        },
        storage: diskStorage({
          destination: configService.get('MULTER_DIST'),
          filename: (req, file, callback) => {
            callback(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
