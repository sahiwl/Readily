import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import bookRoutes from './routes/book.route.js';
import orderRoutes from './routes/order.route.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './src/stats/admin.stats.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
      origin: [process.env.FE_URL1,
      process.env.FE_URL2, process.env.FE_URL3, process.env.FE_MAIN_URL
    ],
    credentials: true
}));

//routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

async function main() {
    await mongoose.connect(process.env.DB_URL);
  
    app.use('/', (req, res) => {
      res.send('Book app is live');
    });
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().then(() => console.log("MongoDB connected successfully")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Book app listening on port ${port}`);
});
