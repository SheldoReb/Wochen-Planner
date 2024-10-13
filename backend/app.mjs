import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes.mjs';
import cuisineRoutes from './routes/cuisineRoutes.mjs'; // Import the new cuisine routes

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://sheldor:Sheldon0@192.168.178.19:27778/meal-planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin' // or the database where the user is created
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message, error.stack);
});

app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'http://192.168.178.19:9988'], // Add the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/recipes', recipeRoutes);
app.use('/api', cuisineRoutes); // Add the new route for cuisines

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`, err.stack);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});