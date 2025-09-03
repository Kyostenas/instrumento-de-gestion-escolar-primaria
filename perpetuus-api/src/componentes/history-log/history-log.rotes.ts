import { Request, Response, Router } from 'express';
import { HistoryLogController } from './history-log.controller';

const HISTORY_LOG_ROUTE = () => {
    const router = Router();

    router.get('/', async (req: Request, res: Response) => {
        return await new HistoryLogController().read(req, res);
    });

    return router;
};

export { HISTORY_LOG_ROUTE };
