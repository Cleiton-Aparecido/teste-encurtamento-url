import { Provider } from '@nestjs/common';
import { UrlsService } from '../services/url.service';
import { UrlUserCase } from '../services/url.usercase';

export const UseCaseProvider: Provider = {
  provide: UrlUserCase,
  useClass: UrlsService,
};
