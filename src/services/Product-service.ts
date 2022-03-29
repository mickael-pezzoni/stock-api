import { CreateProductDto } from './../dtos/create-product.dto';
import { CategoryService } from './Category-service';
import { Product } from './../entities/Product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { GlobalService } from './Global-service';
import { UpdateProductDto } from 'dtos/update-product.dto';

export class ProductService extends GlobalService<Product> {
    categoryService: CategoryService;
    constructor(
        repository: Repository<Product>,
        categoryService: CategoryService
    ) {
        super(repository);
        this.categoryService = categoryService;
    }

    findAll(relations: string[] = [], categoryId?: number) {
        const options: FindManyOptions = {
            relations,
        };
        if (categoryId !== undefined) {
            options.where = { categoryId };
        }
        return this.repository.find(options);
    }
    async create(dto: CreateProductDto): Promise<Product> {
        await this.categoryService.findOne(dto.categoryId);
        const toCreate = this.repository.create(dto);
        return this.repository.save(toCreate);
    }

    async update(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        await this.categoryService.findOne(dto.categoryId);
        const toUpdate = this.repository.create(dto);
        return this.repository.save({ ...product, ...toUpdate });
    }

    async findByCategory(categoryId: number): Promise<Product[]> {
        await this.categoryService.findOne(categoryId);
        return this.repository.find({ where: { categoryId } });
    }
}
