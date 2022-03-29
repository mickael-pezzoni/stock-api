import { SigninDto } from './dtos/signin.dto';
import { Account } from './entities/Account.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateCategoryDto } from './dtos/Update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/Category-service';
import { ProductService } from './services/Product-service';
import { environnement, databaseConnection } from './config';
import { Context, Controller, Server } from 'speedily-js';
import { createConnection } from 'typeorm';
import { Product } from './entities/Product.entity';
import cors from 'cors';
import Logger from 'speedily-js/lib/classes/Logger';
import { AccountService } from './services/Account-service';
import { auth } from './middlewares/auth';

(async () => {
    const server = new Server(environnement.API_PORT);
    server.setGlobalMiddleWare(cors());
    const database = await createConnection(databaseConnection);
    const categoryService = new CategoryService(
        database.getRepository(Category)
    );
    const productService = new ProductService(
        database.getRepository(Product),
        categoryService
    );
    const accountService = new AccountService(database.getRepository(Account));
    accountService
        .create({
            username: environnement.API_ADMIN_ACCOUNT,
            password: environnement.API_ADMIN_PASSWORD,
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {});
    const categoryController = new Controller('/categories')
        .addMiddleware(auth)
        .get('/', () => categoryService.find())
        .get('/:id', (context: Context) =>
            categoryService.findOne(context.params.getOrFail<number>('id'), [
                'products',
            ])
        )
        .get('/:id/products', (context: Context) =>
            productService.findByCategory(
                context.params.getOrFail<number>('id')
            )
        )
        .post(
            '/',
            (context: Context) =>
                categoryService.create(context.body.get<CreateCategoryDto>()),
            { bodyValidator: CreateCategoryDto }
        )
        .put(
            '/:id',
            (context: Context) =>
                categoryService.update(
                    context.params.getOrFail<number>('id'),
                    context.body.get<UpdateCategoryDto>()
                ),
            { bodyValidator: UpdateCategoryDto }
        )
        .delete('/:id', (context: Context) =>
            categoryService.delete(context.params.getOrFail<number>('id'))
        );
    const productController = new Controller('/products')
        .addMiddleware(auth)
        .get('/', (context: Context) =>
            productService.findAll([], context.queryParams.get('categoryId'))
        )
        .get('/:id', (context: Context) =>
            productService.findOne(context.params.getOrFail<number>('id'))
        )
        .post(
            '/',
            (context: Context) =>
                productService.create(context.body.get<CreateProductDto>()),
            { bodyValidator: CreateProductDto }
        )
        .put(
            '/:id',
            (context: Context) =>
                productService.update(
                    context.params.getOrFail<number>('id'),
                    context.body.get<UpdateProductDto>()
                ),
            { bodyValidator: UpdateProductDto }
        )
        .delete('/:id', (context: Context) =>
            productService.delete(context.params.getOrFail<number>('id'))
        );

    const authController = new Controller('/auth').post(
        '/signin',
        (context: Context) =>
            accountService.signin(context.body.get<SigninDto>()),
        { bodyValidator: SigninDto }
    );
    server.setControllers([
        productController,
        categoryController,
        authController,
    ]);

    server.run(() => {
        Logger.debug(
            `[Admin] http://${environnement.API_HOST}:${environnement.ADMIN_PORT}`
        );
        Logger.debug(
            `[Doc] http://${environnement.API_HOST}:${environnement.API_DOC_PORT}`
        );
    });
})();
