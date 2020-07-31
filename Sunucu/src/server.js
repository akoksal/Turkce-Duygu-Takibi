import cors from 'cors';
import express from 'express';
import routes from './routes';
import models from './models';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/operation', routes.operation);
app.use('/result', routes.result);

app.listen(process.env.PORT, () =>{
  console.log(`Example app listening on port ${process.env.PORT}!`);
});