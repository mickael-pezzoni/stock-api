import { environnement } from './../config';
import { NotAuthorizedError } from 'speedily-js';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export function auth(req: Request, _res: Response, next: NextFunction) {
    const authorization = req.headers.authorization as string | undefined;
    if (authorization === undefined || authorization === '') {
        next(new NotAuthorizedError(`Token is missing`));
    }

    const [_bearer, token] = (authorization as string).split(' ');

    if (token === undefined) {
        next(new NotAuthorizedError(`Token is missing`));
    }

    try {
        verify(token as string, environnement.API_SECRET_JWT);
        next();
    } catch {
        next(new NotAuthorizedError(`Bad token`));
    }
}
