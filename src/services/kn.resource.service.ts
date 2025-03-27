import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, QueryPageParams } from '@tsailab/core-types';
import { ErrorCodeEnum, mapToObj } from '@xtsai/xai-utils';
import { KnResourceEntity } from '../entities';
import { KnBaseProcessEnum } from '../enums';
import { CreateKnResourceModel, UpdateKnResourceModel } from '../models';
import { Repository } from 'typeorm';
import { BizException } from '@xtsai/core';

@Injectable()
export class KnowledgeResourceService {
  constructor(
    @InjectRepository(KnResourceEntity)
    private readonly repository: Repository<KnResourceEntity>,
  ) {}

  get knsRepository(): Repository<KnResourceEntity> {
    return this.knsRepository;
  }

  getById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async pagination(dto: QueryPageParams) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      kno,
      state,
    } = dto;

    let qb = this.repository.createQueryBuilder('kns');

    const map = new Map<string, any>();

    if (kno) {
      map.set('kno', kno);
    }

    if (state) {
      map.set('state', state);
    }

    if (map.size > 0) {
      qb = qb.andWhere(mapToObj(map));
    }

    if (keywords?.length) {
      qb = qb.andWhere(
        '(kns.filename LIKE :filename OR kns.keywords LIKE :keywords OR kns.mdpath LIKE :mdpath OR kns.crawler LIKE :crawler)',
        {
          filename: `%${keywords}%`,
          keywords: `%${keywords}%`,
          mdpath: `%${keywords}%`,
          crawler: `${keywords}%`,
        },
      );
    }

    const [data, total] = await qb
      .orderBy('kns.kno', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: (data ?? []).map((e) => ({
        ...e,
        ready: e.state === KnBaseProcessEnum.READY,
      })),
    };
  }

  async createNew(dto: CreateKnResourceModel) {
    const {
      kno,
      filename,
      entryUrl,
      keywords,

      mdfile,
      crawler,
      remark,
      ossInfo,
    } = dto;

    const ossExtra = ossInfo ? JSON.stringify(ossInfo) : undefined;
    return this.repository.save(
      this.repository.create({
        kno,
        filename,
        entryUrl,
        keywords,
        mdfile,
        crawler,
        ossExtra,
        remark,
      }),
    );
  }

  async setKnsState(id: number, state: KnBaseProcessEnum) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(KnResourceEntity)
      .set({ state })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async updateSome(dto: UpdateKnResourceModel) {
    const { id, keywords, mdfile, crawler, state, remark, ossInfo } = dto;

    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(ErrorCodeEnum.DATA_RECORD_CONFLICT);

    if (state !== undefined) {
      find.state = state;
    }

    if (ossInfo) {
      find.ossExtra = JSON.stringify(ossInfo);
    }

    return this.repository.save({
      ...find,
      keywords,
      mdfile,
      crawler,
      remark,
    });
  }
}
