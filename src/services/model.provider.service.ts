import { InjectRepository } from '@nestjs/typeorm';
import { LargeModelEntity } from '../entities';
import { Not, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import {
  AiProviderEnum,
  PageEnum,
  QueryPageParams,
  SelectorOptionsType,
  StatusEnum,
} from '@tsailab/core-types';
import { CreateProviderModel, UpdateProviderModel } from '../models';
import {
  BizException,
  UpdateSortnoModel,
  UpdateStatusModel,
} from '@xtsai/core';
import { ErrorCodeEnum } from '@xtsai/xai-utils';

@Injectable()
export class ModelProviderService {
  protected readonly logger = new Logger(
    `xtsai-knorm:${ModelProviderService.name}`,
  );
  constructor(
    @InjectRepository(LargeModelEntity)
    private readonly repository: Repository<LargeModelEntity>,
  ) {}

  get modelRepository(): Repository<LargeModelEntity> {
    return this.repository;
  }

  async pagination(queryDto: QueryPageParams) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
    } = queryDto;

    let qb = this.repository.createQueryBuilder('m');

    if (keywords?.length) {
      qb = qb.where(
        'm.name LIKE :name OR m.model LIKE :model OR m.modelid LIKE :modelid',
        {
          name: `%${keywords}%`,
          model: `%${keywords}%`,
          modelid: `%${keywords}%`,
        },
      );
    }

    qb = qb.orderBy('m.sortno', 'ASC').addOrderBy('m.provider', 'ASC');

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

  getById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async create(dto: CreateProviderModel): Promise<LargeModelEntity | never> {
    const { model, provider } = dto;
    const modelid = dto.modelid?.length
      ? dto.modelid
      : ModelProviderService.buildModelid(model, provider);
    const find = await this.findByModelid(modelid);

    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `${modelid} 已存在`,
      );

    const entity = await this.repository.save(
      this.repository.create({ ...dto, modelid }),
    );
    return entity;
  }

  findByModelid(modelid: string) {
    return this.repository.findOneBy({ modelid });
  }

  async updateSome(some: UpdateProviderModel) {
    const { id, model, provider } = some;
    const modelid = some.modelid?.length
      ? some.modelid
      : ModelProviderService.buildModelid(model, provider);
    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `Data[${id}] not found.`,
      );

    if (modelid !== find.modelid) {
      const repeat = await this.repository
        .createQueryBuilder()
        .where({
          modelid,
          id: Not(id),
        })
        .getCount();

      if (repeat > 0)
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `Modelid ${modelid} has exists.`,
        );
    }

    return await this.repository.save({ ...some, modelid });
  }

  async setSortno(dto: UpdateSortnoModel): Promise<boolean> {
    const { id, sortno } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(LargeModelEntity)
      .set({ sortno })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async setStatus(dto: UpdateStatusModel): Promise<boolean> {
    const { id, status } = dto;
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(LargeModelEntity)
      .set({ status })
      .where({ id })
      .execute();

    return affected > 0;
  }

  /**
   *
   * @param provider
   * @returns selections
   */
  async getSelection(
    provider?: string,
  ): Promise<Array<SelectorOptionsType<string>>> {
    let qb = this.repository.createQueryBuilder('m');
    if (provider) {
      qb = qb.where({ provider });
    }

    const list = await qb
      .orderBy('m.provider', 'ASC')
      .addOrderBy('m.sortno', 'ASC')
      .getMany();

    if (list?.length) return [];
    return list.map((e) => ModelProviderService.convertSelectionOptions(e));
  }

  static buildModelid(model: string, provider: AiProviderEnum): string {
    return `${provider.valueOf()}@${model}`;
  }

  static convertSelectionOptions(
    entity: LargeModelEntity,
  ): SelectorOptionsType<string> {
    const {
      id,
      name,
      modelid,
      provider,
      model,
      baseUrl,
      status,
      link,
      version,
      classification,
    } = entity;

    const option: SelectorOptionsType<string> = {
      label: name,
      value: modelid,
      disabled: status !== StatusEnum.NORMAL,
      actived: false,
      extra: {
        id,
        provider,
        model,
        baseUrl,
        link,
        version,
        classification,
      },
    };

    return option;
  }
}
