import { environnement } from './../config';
import { SigninDto } from './../dtos/signin.dto';
import { CreateAccountDto } from './../dtos/create-account.dto';
import { Repository } from 'typeorm';
import { Account } from 'entities/Account.entity';
import { GlobalService } from './Global-service';
import { BadRequestError, NotAuthorizedError } from 'speedily-js';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export interface LoginOutput {
    account: Omit<Account, 'password' | 'hashPassword'>;
    jwt: string;
}

export class AccountService extends GlobalService<Account> {
    constructor(accountRepository: Repository<Account>) {
        super(accountRepository);
    }

    async create(createAccountDto: CreateAccountDto): Promise<Account> {
        const account = await this.findByUsername(createAccountDto.username);
        if (account !== undefined) {
            throw new BadRequestError(`Account already exist`);
        }
        const toCreate = this.repository.create(createAccountDto);
        return this.repository.save(toCreate);
    }

    findByUsername(username: string): Promise<Account | undefined> {
        return this.repository.findOne({ username });
    }

    async signin(signinDto: SigninDto): Promise<LoginOutput> {
        const account = await this.findByUsername(signinDto.username);
        if (account === undefined) {
            throw new NotAuthorizedError(`Bad login`);
        }
        const { password, ...accountWithOutPassword } = account;
        const isLogged = await compare(signinDto.password, password);

        if (!isLogged) {
            throw new NotAuthorizedError(`Bad login`);
        }
        const loginOutput: LoginOutput = {
            account: accountWithOutPassword,
            jwt: sign(accountWithOutPassword, environnement.API_SECRET_JWT, {
                expiresIn: environnement.API_JWT_EXPIRATION,
            }),
        };

        return loginOutput;
    }
}
