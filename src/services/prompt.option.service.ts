import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, QueryPageParams, StatusEnum } from '@tsailab/core-types';
import { PromptOptionEntity } from '../entities';
import { CreatePromptOptionDto, UpdatePromptOptionDto } from '../models';
import { Not, Repository } from 'typeorm';
import {
  BizException,
  UpdateSortnoModel,
  UpdateStatusModel,
} from '@xtsai/core';
import { ErrorCodeEnum } from '@xtsai/xai-utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptOptionService {
  constructor(
    @InjectRepository(PromptOptionEntity)
    private readonly repository: Repository<PromptOptionEntity>,
  ) {}

  get optRepository(): Repository<PromptOptionEntity> {
    return this.repository;
  }

  getById(id: number) {
    return this.repository.findOneBy({ id });
  }

  getTemplateOptions(uuids: number[]): Promise<Array<PromptOptionEntity>> {
    return this.repository
      .createQueryBuilder('o')
      .withDeleted()
      .where('o.uuid IN (:...uuids)', { uuids })
      .orderBy('o.uuid', 'ASC')
      .addOrderBy('o.sortno', 'ASC')
      .getMany();
  }

  async pagination(queryDto: QueryPageParams) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      uuid,
    } = queryDto;

    let qb = this.repository.createQueryBuilder('o');
    if (uuid) {
      qb = qb.andWhere({ uuid });
    }
    if (keywords?.length) {
      qb = qb.andWhere(
        '(o.provider LIKE :provider OR o.model LIKE :model OR o.uuid LIKE :uuid)',
        {
          provider: `%${keywords}%`,
          model: `%${keywords}%`,
          uuid: `${keywords}%`,
        },
      );
    }

    const [data, total] = await qb
      .orderBy('o.uuid', 'ASC')
      .addOrderBy('o.sortno', 'ASC')
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

  async createNew(dto: CreatePromptOptionDto) {
    const { uuid, provider, model, name, modelid, aiopts, aiOptsJson, remark } =
      dto;
    const find = await this.findExists(uuid, provider, model);
    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `Model ${model} Options ${provider} had exists in template[${uuid}].`,
      );

    const sortno = await this.getNextSortno(uuid);

    let created: Partial<PromptOptionEntity> = {
      uuid,
      name: name ?? model,
      modelid: modelid,
      provider,
      model,
      aiopts: aiOptsJson ? JSON.stringify(aiOptsJson) : aiopts,
      isDefault: false,
      remark,
      sortno,
      status: StatusEnum.NORMAL,
    };

    created = await this.repository.save(this.repository.create(created));
    return created;
  }

  async updateSome(
    dto: UpdatePromptOptionDto,
  ): Promise<PromptOptionEntity | never> {
    const { id, provider, model, name, modelid, aiopts, aiOptsJson, remark } =
      dto;

    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `${id} not found.`,
      );

    const exists = await this.findRepeat(id, find.uuid, provider, model);
    if (exists)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `Model ${model} Options ${provider} had exists in template[${find.uuid}].`,
      );

    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptOptionEntity)
      .set({
        name: name ?? model,
        modelid,
        provider,
        model,
        aiopts: aiOptsJson ? JSON.stringify(aiOptsJson) : aiopts,
        remark,
      })
      .where({ id })
      .execute();

    if (affected > 0) {
      return {
        ...find,
        name: name ?? model,
        modelid,
        provider,
        model,
        aiopts: aiOptsJson ? JSON.stringify(aiOptsJson) : aiopts,
        remark,
      } as PromptOptionEntity;
    }
  }

  async setDefault(id: number) {
    const find = await this.getById(id);
    if (!find) return false;
    await this.repository
      .createQueryBuilder()
      .update(PromptOptionEntity)
      .set({ isDefault: false })
      .where({ uuid: find.uuid })
      .andWhere({ id: Not(id) })
      .execute();

    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptOptionEntity)
      .set({ isDefault: false })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async setStatus(dto: UpdateStatusModel) {
    const { id, status } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptOptionEntity)
      .set({ status })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async setSortno(dto: UpdateSortnoModel) {
    const { id, sortno } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(PromptOptionEntity)
      .set({ sortno })
      .where({ id })
      .execute();

    return affected > 0;
  }

  findRepeat(id: number, uuid: number, provider: string, model: string) {
    const result = this.repository
      .createQueryBuilder()
      .andWhere({ uuid, provider, model })
      .andWhere({ id: Not(id) })
      .getOne();

    return result;
  }

  findExists(uuid: number, provider: string, model: string) {
    const result = this.repository
      .createQueryBuilder()
      .andWhere({ uuid, provider, model })
      .getOne();

    return result;
  }

  async getNextSortno(uuid: number): Promise<number> {
    const { maxSortno } = await this.repository
      .createQueryBuilder('o')
      .select('Max(o.sortno)', 'maxSortno')
      .where({ uuid })
      .getRawOne();

    if (!maxSortno) return 1;
    return +maxSortno + 1;
  }
}
