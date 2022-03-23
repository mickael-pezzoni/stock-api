import { Repository } from 'typeorm';
import { GlobalService } from './Global-service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from 'dtos/create-category.dto';
import { UpdateCategoryDto } from 'dtos/Update-category.dto';

export class CategoryService extends GlobalService<Category> {
    constructor(repository: Repository<Category>) {
        super(repository);
    }

    create(dto: CreateCategoryDto): Promise<Category> {
        const toCreate = this.repository.create(dto);
        return this.repository.save(toCreate);
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);
        const toUpdate = this.repository.create(dto);
        return this.repository.save({ ...category, ...toUpdate });
    }
}
