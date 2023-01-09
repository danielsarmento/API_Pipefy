import express from 'express';
import homeRouter from './src/routes/homeRoutes.js';

class App {
    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/', homeRouter);
        this.app.use('/createTableRecord', homeRouter);
        this.app.use('/createCard', homeRouter);
    }
}

export default new App().app;