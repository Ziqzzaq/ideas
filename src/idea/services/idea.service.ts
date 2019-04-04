import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {IdeaEntity} from "../models/idea.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {IdeaDto, IdeaRo} from "../models/idea.dto";
import {UserEntity} from "../../user/models/user.entity";
import {ReadIdea} from "../models/readIdea.model";

@Injectable()
export class IdeaService {

    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    private toResponseObject(idea: IdeaEntity): IdeaRo {
        return {
            ...idea,
            author: idea.author ? idea.author.toResponseObject(false) : null
        };
    }

    private ensureOwnership(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }

    public async showAll(): Promise<IdeaRo[]> {
        const ideas = await this.ideaRepository.find({relations: ['author']});
        return ideas.map(idea => this.toResponseObject(idea));
    }

    public async create(userId: string, data: IdeaDto): Promise<IdeaRo> {
        const user = await this.userRepository.findOne({where: {id: userId}});
        const idea = await this.ideaRepository.create({...data, author: user});
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    public async read(data: ReadIdea): Promise<IdeaRo | IdeaRo[]> {
        if (data.ideaId) {
            const idea: IdeaEntity = await this.ideaRepository.findOne({
                where: {id: data.ideaId},
                relations: ['author']
            });
            if (!idea) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            return this.toResponseObject(idea);
        } else if (data.authorId) {
            const ideas: IdeaEntity[] = await this.ideaRepository.find({
                where: {author: data.authorId},
                relations: ['author']
            });
            if (!ideas) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            return ideas.map(idea => this.toResponseObject(idea));
        }
    }

    public async update(id: string, userId:string, data: Partial<IdeaDto>): Promise<IdeaRo> {
        let idea = await this.ideaRepository.findOne({where: id, relations: ['author']});
        if (!idea) {
            throw new HttpException('Cannot found idea to update', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({id}, data);
        idea = await this.ideaRepository.findOne({where: {id, relations: ['author']}});
        return this.toResponseObject(idea);
    }

    public async delete(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({where: id, relations: ['author']});
        if (!idea) {
            throw new HttpException('Cannot found idea to delete', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({id});
        return this.toResponseObject(idea);
    }

}
