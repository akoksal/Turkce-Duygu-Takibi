import { Router } from 'express';
import OperationHandler from '../operation_handler';
import fs from 'fs';

const router = Router();
const path_preifx = '../results/';

router.get('/id/:id', async (req, res) => {
    let operation = await OperationHandler.findById(req.params.id);
    if (operation == null){
        return res.send(null);
    }
    return res.json(fs.readFileSync(path_preifx + operation.result_path, 'utf8'));
});

router.get('/query/:query', async (req, res) => {
    let operation = await OperationHandler.findByQuery(req.params.query);
    if (operation.length <= 0){
        return res.send(null);
    }
    return res.json(fs.readFileSync(path_preifx + operation[0].result_path, 'utf8'));
});

router.get('/volume/id/:id', async (req, res) => {
    let operation = await OperationHandler.findById(req.params.id);
    if (operation == null){
        return res.send(null);
    }
    return res.json(fs.readFileSync(path_preifx + operation.volume_path, 'utf8'));
});

router.get('/volume/query/:query', async (req, res) => {
    let operation = await OperationHandler.findByQuery(req.params.query);
    if (operation.length <= 0){
        return res.send(null);
    }
    return res.json(fs.readFileSync(path_preifx + operation[0].volume_path, 'utf8'));
});

export default router;