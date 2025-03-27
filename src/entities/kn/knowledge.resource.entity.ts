import { CommonEntity } from '@xtsai/core';
import { KnBaseProcessEnum } from '../../enums';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'ai_kn_resource',
  synchronize: true,
  comment: 'kn resources',
})
export class KnResourceEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'filename',
    length: 200,
    default: '',
    comment: 'filename or url title ',
  })
  filename: string;

  @Column({
    type: 'varchar',
    name: 'entry_url',
    length: 256,
    comment: 'url',
  })
  entryUrl: string;

  @Column({
    type: 'longtext',
    name: 'sub_url',
    default: null,
    comment: 'url',
  })
  suburl: string;

  @Column({
    type: 'varchar',
    name: 'kno',
    nullable: false,
    comment: 'knowledge no:kn_xxxx',
  })
  kno: string;

  @Column({
    type: 'longtext',
    name: 'keywords',
    default: null,
    comment: 'keywords split with |',
  })
  keywords: string;

  @Column({
    type: 'longtext',
    name: 'md_paths',
    nullable: true,
    comment: 'md file path on server locale',
  })
  mdpaths: string;
  @Column({
    type: 'varchar',
    name: 'mddir',
    length: 256,
    comment: 'md file base path dir',
  })
  mddir: string;

  @Column({
    type: 'varchar',
    name: 'md_file',
    length: 256,
    comment: 'md file path on oss url',
  })
  mdfile: string;

  @Column({
    type: 'varchar',
    length: 64,
    default: KnBaseProcessEnum.EMPTY,
    comment: 'kn file state process',
  })
  state: KnBaseProcessEnum;

  @Column({
    type: 'varchar',
    name: 'crawler',
    length: 64,
    comment: 'spider rule',
  })
  crawler: string;

  @Column({
    type: 'longtext',
    name: 'oss_extra',
    default: null,
    comment: 'file oss sextra',
  })
  ossExtra: string;

  @Column({
    type: 'varchar',
    name: 'remark',
    length: 512,
    comment: 'remark',
  })
  remark: string;

  ready?: boolean;
}
