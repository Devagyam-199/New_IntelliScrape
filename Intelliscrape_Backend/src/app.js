import express from 'express';
import cors from 'cors';
import router from './Routes/api.userSignUp.routes.js';    

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', router);


export { app }