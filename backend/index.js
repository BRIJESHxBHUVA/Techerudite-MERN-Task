import express from 'express'
import db from './config/database.js';
import cors from 'cors';
import productRoute from "./router/productRoutes.js";
import categoryRoute from "./router/categoryRoutes.js";

const app = express();
app.use(cors({origin: 'http://localhost:3000'}));

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', productRoute);
app.use('/api', categoryRoute);


app.listen(PORT, (err) => {
    if(err) return console.log("Server starting error", err);
    console.log(`Server starting on port ${PORT}`);
})