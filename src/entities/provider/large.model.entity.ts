import { Transform, Type } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  AiProviderEnum,
  LargeModelClassificationEnum,
  StatusEnum,
} from '@tsailab/core-types';

@Entity({
  name: 'ai_large_model',
  synchronize: true,
  comment: 'provider model',
})
export class LargeModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'Primary key ID',
  })
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  id: number;

  @PrimaryColumn({
    name: 'modelid',
    type: 'varchar',
    nullable: false,
    length: 200,
    comment: 'AI model id',
  })
  modelid: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    length: 200,
    comment: 'AI model name',
  })
  name: string;

  @Column({
    name: 'provider',
    type: 'varchar',
    nullable: false,
    length: 64,
    comment: 'AI provider name',
  })
  provider: AiProviderEnum;

  @Column({
    name: 'model',
    type: 'varchar',
    nullable: false,
    length: 200,
    comment: 'AI model id',
  })
  model: string;

  @Column({
    name: 'version',
    type: 'varchar',
    nullable: false,
    length: 200,
    comment: 'AI model version id',
  })
  version: string;

  @Column({
    name: 'classification',
    type: 'varchar',
    nullable: true,
    length: 100,
    default: '',
    comment: 'AI model classification',
  })
  classification: LargeModelClassificationEnum;

  @Column({
    name: 'base_url',
    type: 'varchar',
    nullable: true,
    default: '',
    comment: 'AI provider model base url',
  })
  baseUrl: string;

  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @Column({
    type: 'int',
    nullable: true,
    default: 0,
    name: 'sortno',
    comment: 'AI template sort',
  })
  sortno: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: 'status,0-forbidden,1-normal',
  })
  status: StatusEnum;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 200,
    name: 'link',
    comment: 'link',
  })
  link: string;

  @Column({
    name: 'property_names',
    type: 'varchar',
    nullable: true,
    default: '',
    comment: 'AI model variables property name',
  })
  propertyNames: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    default: '',
    comment: 'AI model description',
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 200,
    name: 'remark',
    comment: ' remark',
  })
  remark: string;
}
