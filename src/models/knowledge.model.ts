import { QueryPageParams } from '@tsailab/core-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { KnBaseProcessEnum } from '../enums';

export interface QueryKnbaseParams extends QueryPageParams {
  group: string;
  available?: boolean;
}

export type KnowledgeBaseType = {
  kno: string;
  title: string;
  available?: boolean;
  group: string;
  tag: string;
  extra: string;
  extraJson?: Record<string, any> | null;
  crawlRules: string;
  crawlerRuleJson?: Record<string, any> | null;
  remark: string;
};

export class CreateKnowledgeBaseModel
  implements Omit<KnowledgeBaseType, 'kno'>
{
  @IsOptional()
  group: string;
  @IsNotEmpty()
  title: string;
  @IsOptional()
  tag: string;
  @IsOptional()
  extra: string;
  @IsOptional()
  extraJson?: Record<string, any>;
  @IsOptional()
  crawlRules: string;
  @IsOptional()
  crawlerRuleJson?: Record<string, any>;
  @IsOptional()
  remark: string;
}

export class UpdateKnowledgeBaseModel
  implements Omit<KnowledgeBaseType, 'kno'>
{
  @IsNotEmpty()
  id: number;
  @IsOptional()
  group: string;
  @IsNotEmpty()
  title: string;
  @IsOptional()
  tag: string;
  @IsOptional()
  extra: string;
  @IsOptional()
  extraJson?: Record<string, any>;
  @IsOptional()
  crawlRules: string;
  @IsOptional()
  crawlerRuleJson?: Record<string, any>;
  @IsOptional()
  remark: string;
}

export class CreateKnResourceModel {
  @IsNotEmpty()
  kno: string;
  @IsOptional()
  filename: string;
  @IsOptional()
  entryUrl: string;
  @IsOptional()
  keywords: string;

  @IsOptional()
  mdfile: string;
  @IsOptional()
  crawler: string;
  @IsOptional()
  remark: string;
  @IsOptional()
  ossInfo?: Record<string, any>;
}

export class UpdateKnResourceModel {
  @IsNotEmpty()
  id: number;
  @IsOptional()
  keywords: string;
  @IsOptional()
  mdfile: string;
  @IsOptional()
  crawler: string;
  @IsOptional()
  state?: KnBaseProcessEnum;
  @IsOptional()
  remark: string;
  @IsOptional()
  ossInfo?: Record<string, any>;
}
