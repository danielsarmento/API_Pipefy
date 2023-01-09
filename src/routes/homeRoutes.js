import { Router } from 'express';
import TableController from '../controllers/TableController.js';

const router = new Router();

router.get('/', TableController.searchData);
router.post('/createTableRecord', TableController.createDataTable);
router.post('/createCard', TableController.createCard);

export default router;