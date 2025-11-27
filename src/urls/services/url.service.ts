import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Url } from 'src/config/entities/url.entity';
import { UrlDeleteDto } from '../dto/url-delete.dto';
import { UrlDto } from '../dto/url.dto';
import { IUrlRepository } from '../interface/url.repository.interface';
import { UrlUserCase } from './url.usercase';

@Injectable()
export class UrlsService implements UrlUserCase {
  constructor(private readonly urlRepository: IUrlRepository) {}

  private generateSlug(length = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  }
  private async generateCode(): Promise<string> {
    const nano = this.generateSlug(6);
    const exists = await this.urlRepository.findOne({ shortCode: nano });
    return exists ? this.generateCode() : nano;
  }

  async shorten(dto: UrlDto, userId?: string): Promise<{ shortUrl: string }> {
    try {
      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT}`;
      let shortCode: string;

      const RESERVED_ROUTES = [
        'auth',
        'docs',
        'shorten',
        'my-urls',
        'urls',
        'api',
      ];

      if (dto.customLink) {
        if (!userId) {
          throw new ForbiddenException(
            'Link customizado permitido apenas para usuários autenticados',
          );
        }

        if (RESERVED_ROUTES.includes(dto.customLink.toLowerCase())) {
          throw new BadRequestException('Link personalizado não permitido');
        }

        const aliasExists = await this.urlRepository.findOne({
          shortCode: dto.customLink,
        });

        if (aliasExists && !aliasExists.deletedAt) {
          throw new ConflictException('Link personalizado já está em uso');
        }

        shortCode = dto.customLink;
      }

      if (!dto.customLink) {
        shortCode = await this.generateCode();
      }

      const url = this.urlRepository.create({
        originalUrl: dto.originalUrl,
        shortCode,
        user: userId ? ({ id: userId } as any) : undefined,
      });
      await this.urlRepository.save(url);

      return {
        shortUrl: `${baseUrl}/${shortCode}`,
      };
    } catch (error) {
      console.error(error);
      throw error instanceof Error ? error : new Error('Erro ao encurtar URL');
    }
  }

  async redirect(code: string): Promise<string> {
    try {
      const url = await this.urlRepository.findOneByOrFail({
        shortCode: code,
      });
      this.urlRepository.updateOneMoreClickCount(url.id);
      return url.originalUrl;
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException();
    }
  }
  async listByUser(userId: string): Promise<Url[]> {
    try {
      return await this.urlRepository.findAll(userId);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException();
    }
  }

  async update(id: string, urlNew: UrlDto, userId: string): Promise<Url> {
    try {
      const url = await this.urlRepository.findOneForIdUser(id, userId);
      if (!url) {
        throw new NotFoundException();
      }
      url.originalUrl = urlNew.originalUrl;
      return this.urlRepository.save(url);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException();
    }
  }

  async delete(urlDelete: UrlDeleteDto) {
    await this.urlRepository.delete(urlDelete);
  }
}
