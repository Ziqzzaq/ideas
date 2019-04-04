import {Module} from '@nestjs/common';
import {IdeaController} from './controllers/idea.controller';
import {IdeaService} from './services/idea.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {IdeaEntity} from "./models/idea.entity";
import {UserEntity} from "../user/models/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
    controllers: [IdeaController],
    providers: [IdeaService]
})
export class IdeaModule {
}