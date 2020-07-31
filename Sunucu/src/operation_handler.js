import models from './models';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import dotenv from 'dotenv';

const handler = {};

handler.findById = async function(id){
    let operation = await models.Operation.findByPk(id)
    .then(op => {
        console.log(`Operation/s found [${op}]`);
        return op;
    }).catch(err => {
        console.log(`ERROR while getting operation by id: ${err}`);
    });

    return operation;
};

handler.findByQuery = async function(query){
    let operation =  await models.Operation.findAll({
        where: {
            query: query
        }
    }).then(op => {
        console.log(`Operation/s found [${op}]`);
        return op;
    }).catch(err => {
        console.log(`ERROR while getting operation by query: ${err}`);
    });

    return operation;
};

handler.getAll = async function(){
    let operation =  await models.Operation.findAll()
    .then(op => {
        console.log(`Operation/s found [${op}]`);
        return op;
    }).catch(err => {
        console.log(`ERROR while getting operation by query: ${err}`);
    });

    return operation;
};

handler.getAllCompleted = async function(){
    let operation =  await models.Operation.findAll({
        where: {
            status: 'Completed'
        }
    })    .then(op => {
        console.log(`Operation/s found [${op}]`);
        return op;
    }).catch(err => {
        console.log(`ERROR while getting operation by query: ${err}`);
    });

    return operation;
};

handler.startOperation = async function(params){
    console.log("Starting")

    console.log(params.query);

    if(!params.query || !params.query.trim()){
        throw `query is not valid ${params.query}`
    }

    await isAnyOperationRunning().catch(() => {
        throw 'another operation is running right now. please try later';
    });

    console.log(await models.Operation.queryExists(params.query));

    if(await models.Operation.queryExists(params.query)){
        throw `query already exists ${params.query}`
    }else{
        console.log('query does not exist');
    }

    let operation_id = uuidv4();
    let operation_name = operation_name in params ? params.operation_name : params.query;
    let result_path = `${operation_name}-${operation_id}.json`
    let volume_path = `${operation_name}-${operation_id}_volume.json`

    result_path = result_path.replace(/ /g, '_');
    volume_path = volume_path.replace(/ /g, '_');

    // insert row for initial operation state
    await models.Operation.init(operation_id, operation_name, params.query)

    // run the model on python
    await executeModel(params.query, result_path, volume_path, operation_id)
    .then(async () => {
       console.log('model execution started');
    }).catch(async (err) => {
        console.log(`ERROR while executing model ${err}`);
        await models.Operation.end(operation_id, 'Failed');
    });
}

async function executeModel(query, result_path, volume_path, operation_id){
    let cmd = `cd ${process.env.REALTIVE_MODEL_PATH} && ./query.sh "${query}" "../results/${result_path}"`;
    console.log(cmd);

    const ls = exec(cmd);
    
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        models.Operation.end(operation_id, 'Failed');
    });
    
    ls.on('close', (code) => {
        if (code == 0){
            models.Operation.end(operation_id, 'Completed', result_path, volume_path);
        }else{
            models.Operation.end(operation_id, 'Failed');
        }
        console.log(`child process exited with code ${code}`);
    })
}

async function isAnyOperationRunning(){
    return new Promise((resolve, reject)=> {
        exec('ps -aux | grep -c query.sh', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if(stdout > 2){
                reject();
            }else{
                resolve();
            }
            return;
        });
    });
}

export default handler;