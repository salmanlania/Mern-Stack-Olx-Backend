import express from "express"
import path from 'path';
const __dirname = path.resolve();
import cors from 'cors';

import productRouter from "./routes/product.mjs"
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));


app.use("/api/v1", productRouter)

app.use(express.static(path.join(__dirname, 'web/dist')))

const PORT = process.env.PORT || 3000

app.listen(process.env.port ||PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})