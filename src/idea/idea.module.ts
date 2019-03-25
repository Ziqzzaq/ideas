import {Module} from '@nestjs/common';
import {IdeaController} from './controllers/idea.controller';
import {IdeaService} from './services/idea.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {IdeaEntity} from "./models/idea.entity";

@Module({
    imports: [TypeOrmModule.forFeature([IdeaEntity])],
    controllers: [IdeaController],
    providers: [IdeaService]
})
export class IdeaModule {
}
