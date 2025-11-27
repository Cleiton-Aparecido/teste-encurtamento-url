import { Url } from 'src/config/entities/url.entity';
import { UrlDeleteDto } from '../dto/url-delete.dto';

export abstract class IUrlRepository {
  abstract findOne(filter: Partial<Url>): Promise<Url | null>;

  abstract findOneByOrFail(filter: Partial<Url>): Promise<Url>;

  abstract save(url: Url): Promise<Url>;

  abstract create(data: Partial<Url>): Url;

  abstract findAll(userId: string): Promise<Url[]>;

  abstract delete(urlDelete: UrlDeleteDto): Promise<any>;

  abstract updateOneMoreClickCount(id: string): Promise<any>;

  abstract findOneForIdUser(id: string, userId: string): Promise<Url | null>;
}
