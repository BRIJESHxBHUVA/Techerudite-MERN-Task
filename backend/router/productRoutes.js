import express from 'express';
import { createProduct, deleteProduct, getProducts } from '../controller/productController.js';

const router = express.Router();

router.post('/product', createProduct);
router.get('/products', getProducts);
router.delete('/product/:id', deleteProduct);

export default router;