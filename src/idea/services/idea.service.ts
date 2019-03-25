import {Injectable} from '@nestjs/common';
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
        return await this.ideaRepository.findOne({where: {id}});
    }

    public async update(id: string, data: Partial<IdeaDto>) {
        await this.ideaRepository.update({id}, data);
        return await this.ideaRepository.findOne({id});
    }

    public async delete(id: string) {
        await this.ideaRepository.delete({id});
        return {deleted: true};
    }

}
