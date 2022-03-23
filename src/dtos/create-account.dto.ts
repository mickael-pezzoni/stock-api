import { IsString, Length } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    @Length(4)
    username!: string;

    @IsString()
    password!: string;
}
