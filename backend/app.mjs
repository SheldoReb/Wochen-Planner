import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes.mjs';
import cuisineRoutes from './routes/cuisineRoutes.mjs'; // Existing cuisine routes

// Import Swagger packages
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meal Planner API',
      version: '1.0.0',
      description: 'API documentation for the Meal Planner application',
    },
    servers: [
      {
        url: 'http://localhost:' + PORT,
      },
    ],
  },
  apis: ['./routes/*.mjs'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Connect to MongoDB
mongoose.connect('mongodb://sheldor:Sheldon0@192.168.178.19:27778/meal-planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message, error.stack);
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'http://192.168.178.19:9988'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

// API Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api', cuisineRoutes); // Existing cuisine routes

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`, err.stack);
  } else {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  }
});