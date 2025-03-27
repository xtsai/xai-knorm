import {
  AiProviderEnum,
  LargeModelClassificationEnum,
  StatusEnum,
} from '@tsailab/core-types';

export type ProviderModelBaseType = {
  version: string;
  classification: LargeModelClassificationEnum;
  baseUrl: string;
  sortno: number;
  status: StatusEnum;
  link: string;
  propertyNames: string;
  description: string;
  remark: string;
};

export type CreateProviderModel = {
  modelid: string;
  name: string;
  provider: AiProviderEnum;
  model: string;
} & Partial<ProviderModelBaseType>;

export type UpdateProviderModel = {
  id: number;
  modelid: string;
  name: string;
  provider: AiProviderEnum;
  model: string;
} & Partial<ProviderModelBaseType>;
