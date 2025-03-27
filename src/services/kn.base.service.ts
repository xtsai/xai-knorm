import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum } from '@tsailab/core-types';
import { mapToObj, RandomUtil } from '@xtsai/xai-utils';
import { KnBaseEntity } from '../entities';
import {
  CreateKnowledgeBaseModel,
  QueryKnbaseParams,
  UpdateKnowledgeBaseModel,
} from '../models';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class KnbaseService {
  constructor(
    @InjectRepository(KnBaseEntity)
    private readonly repository: Repository<KnBaseEntity>,
  ) {}

  get knRepository(): Repository<KnBaseEntity> {
    return this.repository;
  }

  getById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async pagination(queryDto: QueryKnbaseParams) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      group,
      available,
    } = queryDto;

    let qb = this.repository.createQueryBuilder('kn');
    const map = new Map<string, any>();
    if (group || available !== undefined) {
      if (group) map.set('kn.group', group);

      if (available) map.set('kn.available', Equal(true));

      qb = qb.andWhere(mapToObj(map));
    }

    if (keywords?.length) {
      qb = qb.andWhere(
        '(kn.title LIKE :title OR kn.kno LIKE :kno OR kn.tag LIKE :tag)',
        {
          title: `%${keywords}%`,
          kno: `${keywords}%`,
          tag: `%${keywords}%`,
        },
      );
    }

    const [data, total] = await qb
      .orderBy('kn.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: (data ?? []).map((e) => KnBaseEntity.parseJsonProperties(e)),
    };
  }

  createNew(dto: CreateKnowledgeBaseModel) {
    const { title, group, tag, extraJson, crawlerRuleJson, remark } = dto;

    const crawlRules = crawlerRuleJson
      ? JSON.stringify(crawlerRuleJson)
      : dto.crawlRules;
    const extra = extraJson ? JSON.stringify(extraJson) : dto.extra;

    const kno = KnbaseService.generateKno();

    return this.repository.save(
      this.repository.create({
        kno,
        title,
        group,
        tag,
        extra,
        crawlRules,
        available: false,
        remark,
      }),
    );
  }

  async updateSome(dto: UpdateKnowledgeBaseModel) {
    const {
      id,
      group,
      title,
      tag,
      extra,
      extraJson,
      crawlRules,
      crawlerRuleJson,
      remark,
    } = dto;

    const find = await this.getById(id);

    const updated = {
      ...find,
      title,
      group,
      tag,
      extra: extraJson ? JSON.stringify(extraJson) : extra,
      crawlRules: crawlerRuleJson
        ? JSON.stringify(crawlerRuleJson)
        : crawlRules,
      remark,
    };

    return await this.repository.save(updated);
  }

  async setAvailable(id: number, available?: boolean) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(KnBaseEntity)
      .set({ available: Boolean(available) })
      .where({ id })
      .execute();

    return affected > 0;
  }

  static generateKno(): string {
    const { no } = RandomUtil.randomNo36BaseTime(4);
    return `kn_${no}`;
  }
}
