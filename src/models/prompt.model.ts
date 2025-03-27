import { QueryOptionsDto } from '@xtsai/core';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PromptTemplateTypeEnum } from '../enums';
import { StatusEnum, XChatMessageType } from '@tsailab/core-types';

export type BasePromptTemplateType = {
  title: string;
  group: string;
  petype: PromptTemplateTypeEnum | string;
  kno: string;
  systemMessage: string;
  presetMessages: string;
  remark: string;
  presetMessagesJson?: Array<XChatMessageType>;
};

export class QueryPromptTemplateDto extends QueryOptionsDto {
  @IsOptional()
  provider: string;

  @IsOptional()
  group: string;
}

export class CreatePromptTemplateDto implements BasePromptTemplateType {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  group: string;
  @IsOptional()
  petype: string;
  @IsOptional()
  kno: string;
  @IsOptional()
  systemMessage: string;
  @IsOptional()
  presetMessages: string;
  @IsOptional()
  presetMessagesJson?: XChatMessageType[];
  @IsOptional()
  remark: string;
}

export class UpdatePromptTemplate implements BasePromptTemplateType {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;
  @IsOptional()
  group: string;
  @IsOptional()
  petype: string;
  @IsOptional()
  kno: string;
  @IsOptional()
  systemMessage: string;
  @IsOptional()
  presetMessages: string;
  @IsOptional()
  remark: string;
  @IsOptional()
  presetMessagesJson?: XChatMessageType[];
}

export type BasePromptOptionType = {
  uuid: number;
  name: string;
  modelid: string;
  provider: string;
  model: string;
  aiopts: string;
  aiOptsJson?: Record<string, any>;
  isDefault?: boolean;
  remark: string;
};

export class CreatePromptOptionDto implements BasePromptOptionType {
  @IsNotEmpty()
  uuid: number;
  @IsOptional()
  name: string;
  @IsNotEmpty()
  modelid: string;
  @IsNotEmpty()
  provider: string;
  @IsNotEmpty()
  model: string;
  @IsOptional()
  aiopts: string;
  @IsOptional()
  aiOptsJson?: Record<string, any>;
  @IsOptional()
  isDefault?: boolean;
  @IsOptional()
  remark: string;
}

export class UpdatePromptOptionDto
  implements Omit<BasePromptOptionType, 'uuid'>
{
  @IsNotEmpty()
  id: number;
  @IsOptional()
  name: string;
  @IsNotEmpty()
  modelid: string;
  @IsNotEmpty()
  provider: string;
  @IsNotEmpty()
  model: string;
  @IsOptional()
  aiopts: string;
  @IsOptional()
  aiOptsJson?: Record<string, any>;
  @IsOptional()
  isDefault?: boolean;
  @IsOptional()
  remark: string;
}

export type ModelOptionCacheType = {
  id: number;
  uuid: number;
  name: string;
  modelid: string;
  provider: string;
  model: string;
  aiOptsJson?: Record<string, any>;
  isDefault: boolean;
  sortno: number;
  status: StatusEnum;
};

export class PromptEngineerTemplateCache {
  uuid: number;
  title: string;
  group: string;
  kno: string;
  petype: PromptTemplateTypeEnum | string;
  systemMessage: string;
  status: StatusEnum;
  presetMessagesJson?: XChatMessageType[];
  models: Array<ModelOptionCacheType>;
}
