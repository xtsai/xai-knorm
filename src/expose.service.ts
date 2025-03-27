import { Provider } from '@nestjs/common';

import {
  KnbaseService,
  KnowledgeResourceService,
  PromptTemplateService,
  PromptOptionService,
  ModelProviderService,
} from './services';

export const shareServices: Provider[] = [
  KnbaseService,
  KnowledgeResourceService,
  ModelProviderService,
  PromptTemplateService,
  PromptOptionService,
];
