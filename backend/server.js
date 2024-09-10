import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes/routes.js';


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// cors anfragen vom Frontend erlauben
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/', routes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}
).catch((err) => {
  console.log(`MongoDB connection error: , ${err.message}`)});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// Optional:

// import compression from 'compression';

// Für die Datenkomprimierung
// app.use(compression());



// Statische daten nach dem Build

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
// res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });