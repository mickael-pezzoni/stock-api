import { NotFoundError } from 'speedily-js';
import { DeleteResult, FindManyOptions, Repository } from 'typeorm';
export class GlobalService<T> {
    repository: Repository<T>;
    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    find(relations: string[] = []): Promise<T[]> {
        const options: FindManyOptions = {
            relations,
        };
        return this.repository.find(options);
    }

    async findOne(id: number, relations: string[] = []): Promise<T> {
        const item = await this.repository.findOne(id, { relations });

        if (item === undefined) {
            throw new NotFoundError(
                `${this.repository.metadata.name} #${id} not found`
            );
        }
        return item;
    }

    async delete(id: number): Promise<DeleteResult> {
        void (await this.findOne(id));
        return this.repository.delete(id);
    }
}
