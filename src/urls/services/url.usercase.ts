import { Url } from 'src/config/entities/url.entity';
import { UrlDto } from '../dto/url.dto';
import { UrlDeleteDto } from '../dto/url-delete.dto';

export abstract class UrlUserCase {
  abstract shorten(dto: UrlDto, userId?: string): Promise<{ shortUrl: string }>;
  abstract redirect(code: string): Promise<string>;
  abstract listByUser(userId: string): Promise<Url[]>;
  abstract update(id: string, urlNew: UrlDto, userId: string): Promise<Url>;
  abstract delete(urlDelete: UrlDeleteDto): Promise<void>;
}
