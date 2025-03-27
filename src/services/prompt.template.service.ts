import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptTemplateEntity } from '../entities';
import {
  CreatePromptTemplateDto,
  QueryPromptTemplateDto,
  UpdatePromptTemplate,
} from '../models';
import { Equal, Repository } from 'typeorm';
import { PageEnum, StatusEnum } from '@tsailab/core-types';
import { mapToObj } from '@xtsai/xai-utils';
import { UpdateSortnoModel, UpdateStatusModel } from '@xtsai/core';

@Injectable()
export class PromptTemplateService {
  public readonly startUuid: number = 5000;
  constructor(
    @InjectRepository(PromptTemplateEntity)
    private readonly repository: Repository<PromptTemplateEntity>,
  ) {}

  get petRepository(): Repository<PromptTemplateEntity> {
    return this.repository;
  }

  async pagination(queryDto: QueryPromptTemplateDto) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      provider,
      group,
    } = queryDto;

    let qb = this.repository.createQueryBuilder('p');

    const map = new Map<string, any>();
    if (provider) {
      map.set('provider', Equal(provider));
    }

    if (group) {
      map.set('group', Equal(group));
    }

    qb = qb.where(mapToObj(map));

    if (keywords?.length) {
      qb = qb.andWhere(
        '(title LIKE :title OR kno LIKE :kno OR remark LIKE :remark)',
        {
          title: `%${keywords}%`,
          kno: `${keywords}%`,
          remark: `%${keywords}%`,
        },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: data ?? [],
    };
  }

  async createNew(dto: CreatePromptTemplateDto) {
    const {
      title,
      group,
      petype,
      kno,
      systemMessage,
      presetMessagesJson,
      remark,
    } = dto;
    const presetMessages = presetMessagesJson
      ? JSON.stringify(presetMessagesJson)
      : dto.presetMessages;

    const uuid = await this.nextUuid();
    const sortno = await this.nextSortno();

    const result = await this.repository.save(
      this.repository.create({
        title,
        group,
        petype,
        kno,
        systemMessage,
        remark,
        presetMessages,
        sortno,
        status: StatusEnum.NORMAL,
        id: uuid,
      }),
    );

    return result;
  }

  async updateSomePromptTemplate(some: UpdatePromptTemplate) {
    const {
      id,
      title,
      kno,
      group,
      petype,
      presetMessagesJson,
      systemMessage,
      remark,
    } = some;
    let presetMessages = some.presetMessages;
    if (presetMessagesJson) {
      presetMessages = JSON.stringify(presetMessagesJson);
    }

    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptTemplateEntity)
      .set({ title, kno, group, petype, systemMessage, remark, presetMessages })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async setStatus(dto: UpdateStatusModel) {
    const { id, status } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptTemplateEntity)
      .set({ status })
      .where({ id })
      .execute();
    return affected > 0;
  }

  async setSortno(dto: UpdateSortnoModel) {
    const { id, sortno } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptTemplateEntity)
      .set({ sortno })
      .where({ id })
      .execute();
    return affected > 0;
  }

  async nextUuid() {
    const { maxUuid } = await this.repository
      .createQueryBuilder('p')
      .select('MAX(p.id)', 'maxUuid')
      .getRawOne();

    if (!maxUuid) return this.startUuid;
    return parseInt(maxUuid as string) + 1;
  }

  async nextSortno() {
    const { maxSortno } = await this.repository
      .createQueryBuilder()
      .select('MAX(sortno)', 'maxSortno')
      .getRawOne();

    if (!maxSortno) return 1;
    return +maxSortno + 1;
  }
}
