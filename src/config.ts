import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy';

dotenv.config({
    path:
        process.env['NODE_ENV'] === 'production'
            ? '.env'
            : `.env.${process.env['NODE_ENV']}`,
});

export const environnement = {
    API_PORT: parseInt(process.env['API_PORT'] as string, 10),
    API_NAME: process.env['API_NAME'] as string,
    API_HOST: process.env['API_HOST'] as string,
    ADMIN_PORT: parseInt(process.env['ADMIN_PORT'] as string, 10),
    API_DOC_PORT: parseInt(process.env['API_DOC_PORT'] as string, 10),
    API_ADMIN_ACCOUNT: process.env['API_ADMIN_ACCOUNT'] as string,
    API_ADMIN_PASSWORD: process.env['API_ADMIN_PASSWORD'] as string,
    API_SECRET_JWT: process.env['API_SECRET_JWT'] as string,
    API_JWT_EXPIRATION: process.env['API_JWT_EXPIRATION'] as string,
    isProduction: process.env['NODE_ENV'] === 'production',
};

export const databaseConnection: ConnectionOptions = {
    type: 'mariadb',
    username: process.env['DB_USER'] as string,
    host: process.env['DB_HOST'] as string,
    password: process.env['DB_PASS'] as string,
    port: parseInt(process.env['DB_PORT'] as string, 10),
    charset: 'utf8_general_ci',
    database: process.env['DB_DATABASE'] as string,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    synchronize: !environnement.isProduction,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
};
