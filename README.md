```markdown
# Meal Planner

Meal Planner is a user-friendly web application designed to help families efficiently organize their weekly meals. Users can plan a weekly menu using recipes from a customizable database, with features such as recipe management, filtering, and database cleaning to provide a smooth and personalized meal planning experience.

## Overview

The Meal Planner application is built using a microservices architecture to ensure scalability and maintainability. The frontend is developed with React and Vite, providing a dynamic and responsive user interface. The backend is implemented using Node.js and Express, handling API requests and business logic, while MongoDB is used as the database to store recipes and user data. The application comprises the following components:

1. **Frontend**: Developed with React, utilizing Vite for fast development and hot-reloading. It communicates with the backend via RESTful APIs.
2. **Backend**: Built with Node.js and Express, managing user authentication, recipe management, and meal planning features. Mongoose is used as the ORM to interact with MongoDB.
3. **Database**: MongoDB stores recipe data, user information, and meal plans, accessed via the Mongoose ORM.
4. **Authentication**: Session-based authentication using express-session and bcrypt for password hashing.
5. **API**: RESTful API endpoints for managing recipes, meal plans, and user data.
6. **Deployment**: The application is containerized using Docker for easy deployment and scalability.

The project structure includes the following key directories and files:

- `frontend/`: Contains the React application source code.
- `backend/`: Contains the Node.js backend application source code.
- `docker-compose.yml`: Orchestrates the build and deployment of backend, frontend, and MongoDB services.
- `Dockerfile`: Defines the Docker image for the application.
- `.env`: Configuration file for environment variables.

## Features

Meal Planner offers a range of features designed to enhance the meal planning process:

- **Landing Page**: A clean, visually appealing design with a weekly calendar view, responsive layout, and color-coded meal categories.
- **Weekly Meal Display**: Grid layout showing all seven days of the week with recipe details and quick action buttons.
- **Recipe Management**: Upload new recipes via form or JSON file, edit existing recipes, and manually assign recipes to specific days.
- **Filtering System**: Filter recipes by cuisine type, dietary restrictions, preparation time, difficulty, and main ingredient. Save filter preferences for future use.
- **Recipe Database**: Uses MongoDB to store recipes, ensuring no duplicates with a cleaning feature to remove duplicates.
- **Error Handling**: Implements error handling for recipe uploads to ensure data integrity and provides meaningful error messages.
- **Duplicate Detection**: Notifies users of duplicate recipes during uploads and offers options to replace or cancel.
- **Frontend Enhancements**: Dropdown menu for cuisine type filter, checkbox for selecting days to apply filters, and improved layout for user-friendly experience.

## Getting started

### Requirements

To run the Meal Planner application, the following technologies are required:

- Node.js
- MongoDB (or use a cloud version like MongoDB Atlas)
- Docker (for containerization)

### Quickstart

To set up and run the Meal Planner application, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project root directory.
3. Ensure Docker is installed and running on your system.
4. Run `docker-compose up` to build and start the application containers.
5. Access the application via your web browser at `http://localhost:80`.

### License

The project is proprietary. Copyright (c) 2024.
```