/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { StatusEnum } from '@tsailab/core-types';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { PromptTemplateTypeEnum } from '../../enums';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromptOptionEntity } from './prompt.option.entity';

@Entity({
  name: 'ai_prompt_template',
  synchronize: true,
  comment: 'AI Pet',
})
export class PromptTemplateEntity extends BaseEntity {
  /**
   * UUID auto start 5000
   */
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'the prompt uuid',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'title',
    nullable: true,
    length: 128,
    comment: 'template title',
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'group',
    nullable: true,
    length: 64,
    comment: 'use dict pet_group',
  })
  group: string;

  @Column({
    type: 'varchar',
    name: 'petype',
    nullable: true,
    length: 64,
    comment: 'Pet type',
  })
  petype: PromptTemplateTypeEnum | string;

  @Column({
    type: 'varchar',
    name: 'kno',
    nullable: true,
    length: 64,
    comment: 'knowledge string no',
  })
  kno: string;

  @Column({
    type: 'longtext',
    name: 'system_message',
    nullable: true,
    default: null,
    comment: 'system role message string',
  })
  systemMessage: string;

  @Column({
    type: 'longtext',
    name: 'preset_messages',
    nullable: true,
    default: null,
    comment: 'preset chat messages array',
  })
  presetMessages: string;

  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @Column({
    type: 'int',
    nullable: true,
    default: 0,
    name: 'sortno',
    comment: 'record sort number',
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
    name: 'remark',
    nullable: true,
    length: 256,
    comment: 'remark',
  })
  remark: string;

  models: PromptOptionEntity[];

  @Transform((row: TransformFnParams) => +new Date(row.value))
  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'created_at',
    comment: 'record create time',
  })
  createdAt: Date;

  @Transform((row: TransformFnParams) => +new Date(row.value))
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    comment: 'record last update time',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'deleted_at',
    comment: 'Logic delete sign',
  })
  deletedAt?: Date;
}
