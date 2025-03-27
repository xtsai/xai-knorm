import { Provider } from '@nestjs/common';

import {
  PromptTemplateService,
  PromptOptionService,
  ModelProviderService,
} from './services';

export const shareServices: Provider[] = [
  ModelProviderService,
  PromptTemplateService,
  PromptOptionService,
];
