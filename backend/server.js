const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/app', routes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}
).catch((err) => {
  console.log(`MongoDB connection error: , ${err.message}`)});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Optional: Für die Datenkomprimierung

// const compression = require('compression');
// const path = require('path');

// // Für die Datenkomprimierung
// app.use(compression());

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });