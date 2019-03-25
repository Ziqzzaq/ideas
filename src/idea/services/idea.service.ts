import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {IdeaEntity} from "../models/idea.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {IdeaDto} from "../models/idea.dto";

@Injectable()
export class IdeaService {

    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>
    ) {
    }

    public async showAll() {
        return await this.ideaRepository.find();
    }

    public async create(data: IdeaDto) {
        const idea = await this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    }

    public async read(id: string) {
        const idea = await this.ideaRepository.findOne({where: {id}});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return idea
    }

    public async update(id: string, data: Partial<IdeaDto>) {
        const idea = await this.ideaRepository.findOne({where: id});
        if (!idea) {
            throw new HttpException('Cannot found idea to update', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({id}, data);
        return idea;
    }

    public async delete(id: string) {
        const idea = await this.ideaRepository.findOne({where: id});
        if (!idea) {
            throw new HttpException('Cannot found idea to delete', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.delete({id});
        return idea;
    }

}
