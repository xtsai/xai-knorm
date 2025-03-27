import { CommonEntity } from '@xtsai/core';
import { Column, Entity, Index } from 'typeorm';
import { Transform, Type } from 'class-transformer';

@Entity({
  name: 'ai_kn_base',
  synchronize: true,
  comment: '知识库',
})
export class KnBaseEntity extends CommonEntity {
  @Index()
  @Column({
    type: 'varchar',
    name: 'kno',
    nullable: false,
    comment: 'knowledge no:kn_xxxx',
  })
  kno: string;

  @Column({
    type: 'varchar',
    name: 'title',
    length: 64,
    comment: 'title',
  })
  title: string;

  @Type(() => Boolean)
  @Transform(({ value }) => Boolean(value))
  @Column({
    type: 'tinyint',
    name: 'available',
    default: 0,
    comment: '可用状态',
  })
  available: boolean;

  @Column({
    type: 'varchar',
    name: 'kn_group',
    length: 64,
    comment: 'group from dict:knowledge_group',
  })
  group: string;

  @Column({
    type: 'varchar',
    name: 'tag',
    length: 1000,
    comment: 'tag: chatbot,agent',
  })
  tag: string;

  @Column({
    type: 'longtext',
    name: 'extra',
    comment: 'extra info json string',
  })
  extra: string;

  extraJson?: Record<string, any> | null;

  @Column({
    type: 'longtext',
    name: 'craw_rules',
    comment: 'extra info json string',
  })
  crawlRules: string;

  crawlerRuleJson?: Record<string, any> | null;

  @Column({
    type: 'varchar',
    name: 'remark',
    length: 512,
    comment: 'remark',
  })
  remark: string;

  static parseJsonProperties(entity: KnBaseEntity): KnBaseEntity {
    const { extra, crawlRules } = entity;
    let extraJson;
    let crawlerRuleJson;

    try {
      if (extra?.length)
        extraJson = JSON.parse(extra) as unknown as Record<string, any>;
    } catch (_) {
      //skip parse fail
    }

    try {
      if (crawlRules?.length) crawlerRuleJson = JSON.parse(crawlRules);
    } catch (_) {
      //skip parse fail
    }

    return {
      ...entity,
      extraJson,
      crawlerRuleJson,
    } as unknown as KnBaseEntity;
  }

  static toStringProperties(enity: KnBaseEntity): KnBaseEntity {
    const { extraJson, crawlerRuleJson } = enity;

    if (extraJson) {
      enity.extra = JSON.stringify(extraJson);
    }

    if (crawlerRuleJson) {
      enity.crawlRules = JSON.stringify(crawlerRuleJson);
    }

    return enity;
  }
}
