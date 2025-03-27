import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { registEntities } from './entities/regist.entities';
import { shareServices } from './expose.service';

@Module({
  providers: [],
  exports: [],
})
export class XKnormModule {
  static forRoot(global: boolean = false) {
    return {
      global,
      module: XKnormModule,
      imports: [ConfigModule, TypeOrmModule.forFeature([...registEntities])],
      providers: [...shareServices],
      exports: [...shareServices],
    };
  }
}
