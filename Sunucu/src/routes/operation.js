import { Router } from 'express';
import OperationHandler from '../operation_handler';

const router = Router();

router.get('/', async (req, res) => {
    const operation = await OperationHandler.getAll();
    return res.send(operation);
});

router.get('/id/:id', async (req, res) => {
    const operation = await OperationHandler.findById(req.params.id);
    return res.send(operation);
});

router.get('/query/:query', async (req, res) => {
    const operation = await OperationHandler.findByQuery(req.params.query);
    return res.send(operation);
});

router.get('/completed', async (req, res) => {
    const operation = await OperationHandler.getAllCompleted();
    return res.send(operation);
});

router.post('/start', async (req, res) => {
    const operation = await OperationHandler.startOperation(req.body)
    .then(() => {
        return res.send('operation started');
    }).catch(error =>{
        return res.send('error: ' + error);
    });
});

export default router;