import { CreateProductDto } from './../dtos/create-product.dto';
import { CategoryService } from './Category-service';
import { Product } from './../entities/Product.entity';
import { Repository } from 'typeorm';
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
}
