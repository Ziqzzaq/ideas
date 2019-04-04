import {Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {IdeaService} from "../services/idea.service";
import {IdeaDto} from "../models/idea.dto";
import {ValidationPipe} from "../../shared/validation.pipe";
import {AuthGuard} from "../../shared/auth.guard";
import {User} from "../../user/decorators/user.decorator";
import {ReadIdea} from "../models/readIdea.model";

@Controller('api/ideas')
export class IdeaController {
    private logger = new Logger('IdeaController');

    constructor(private ideaService: IdeaService) {
    }


    private logData(options: any) {
        options.user && this.logger.log('USER' + JSON.stringify(options.user));
        options.data && this.logger.log('DATA' + JSON.stringify(options.body));
        options.id && this.logger.log('IDEA' + JSON.stringify(options.id));
    }

    @Get()
    @UseGuards(new AuthGuard())
    showAllIdeas() {
        return this.ideaService.showAll();
    }

    @Post('create')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User('id') userId, @Body() data: IdeaDto) {
        this.logData({userId, data});
        this.logger.log(JSON.stringify(data));
        return this.ideaService.create(userId, data);
    }

    @Post('read')
    readIdea(@Body() data: ReadIdea) {
        return this.ideaService.read(data);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @User('id') userId: string, @Body() data: Partial<IdeaDto>) {
        this.logData({id, userId, data});
        return this.ideaService.update(id, userId, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    removeIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({id, userId});
        return this.ideaService.delete(id, userId);
    }
}
