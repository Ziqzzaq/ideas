import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {UserService} from "../services/user.service";
import {UserDto} from "../models/user.dto";
import {ValidationPipe} from "../../shared/validation.pipe";

@Controller()
export class UserController {

    constructor(private userService: UserService) {}

    @Get('api/users')
    showAllUsers() {
        return this.userService.showAllUser();
    }


    @Post('auth/login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto) {
        return this.userService.login(data);
    }

    @Post('auth/register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDto) {
        return this.userService.register(data);
    }
}
