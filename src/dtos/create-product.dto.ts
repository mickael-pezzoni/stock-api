import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @Length(4)
    name!: string;

    @IsString()
    @IsOptional()
    description!: string;

    @IsNumber()
    quantity!: number;

    @IsNumber()
    categoryId!: number;
}
