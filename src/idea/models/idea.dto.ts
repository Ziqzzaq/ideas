import {IsString} from "class-validator";
import {UserRo} from "../../user/models/user.dto";

export class IdeaDto {

    @IsString()
    idea: string;

    @IsString()
    description: string;
}

export class IdeaRo {
    id?: string;
    updated: Date;
    created: Date;
    idea: string;
    description: string;
    author: UserRo;
}