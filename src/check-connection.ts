import { databaseConnection } from './config';
import { createConnection } from 'typeorm';

(async () => {
    try {
        await createConnection(databaseConnection);
        process.exit(0);
    } catch {
        process.exit(1);
    }
})();
