import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import recipeRoutes from './routes/recipeRoutes.mjs'
import cuisineRoutes from './routes/cuisineRoutes.mjs'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const mongoUri = process.env.MONGODB_URI || 'mongodb://sheldor:Sheldon0@192.168.178.19:27778/meal-planner'

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message, error.stack)
})

const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost', 'http://localhost:5173']

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json())
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`)
  next()
})
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use('/api/recipes', recipeRoutes)
app.use('/api', cuisineRoutes)

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`, err.stack)
  } else {
    console.log(`Server is running on port ${PORT}`)
  }
})