import { BaseSimpleEntity } from '@xtsai/core';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, Unique } from 'typeorm';

@Entity({
  name: 'ai_prompt_options',
  synchronize: true,
  comment: 'pet model options',
})
@Unique('po_uuid_model', ['uuid', 'provider', 'model'])
export class PromptOptionEntity extends BaseSimpleEntity {
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @Column({
    type: 'int',
    name: 'uuid',
    nullable: false,
    comment: 'reffer pet uuid',
  })
  uuid: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
    length: 100,
    comment: 'AI model name',
  })
  name: string;

  @Column({
    name: 'modelid',
    type: 'varchar',
    nullable: false,
    length: 200,
    comment: 'AI model id',
  })
  modelid: string;

  @Column({
    name: 'provider',
    type: 'varchar',
    nullable: false,
    length: 64,
    comment: 'AI provider name',
  })
  provider: string;

  @Column({
    name: 'model',
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: 'AI model id',
  })
  model: string;

  @Column({
    name: 'aiopts',
    type: 'longtext',
    nullable: true,
    default: null,
    comment: 'Model options',
  })
  aiopts: string;

  @Type(() => Boolean)
  @Transform(({ value }) => Boolean(value))
  @Column({
    type: 'tinyint',
    name: 'is_default',
    nullable: true,
    default: 0,
    comment: 'default',
  })
  isDefault: boolean;

  @Column({
    type: 'varchar',
    name: 'remark',
    nullable: true,
    comment: 'remark',
  })
  remark: string;
}
