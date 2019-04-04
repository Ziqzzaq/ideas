import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from "../models/user.entity";
import {Repository} from "typeorm";
import {UserDto, UserRo} from "../models/user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {

    }


    public async showAllUser(): Promise<UserRo[]> {
        const user = await this.userRepository.find({relations: ['ideas']});
        return user.map(user => user.toResponseObject(true));
    }

    public async login(data: UserDto): Promise<UserRo> {
        const {username, password} = data;
        const user = await this.userRepository.findOne({where: {username}});
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST
            )
        }
        return user.toResponseObject();
    }

    public async register(data: UserDto): Promise<UserRo> {
        const {username} = data;
        let user = await this.userRepository.findOne({where: {username}});
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }

}
