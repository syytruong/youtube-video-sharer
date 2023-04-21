# youtube-video-sharer
A full-stack web application that allows users to vote on movies. Users can create movie entries, upvote or downvote movies, and view a list of movies sorted by votes. The application uses React for the frontend, Express and Node.js for the backend, and MongoDB as the database.

## Features
 - User registration and login
 - Authentication and protected routes
 - Create movie entries with title, description, and YouTube URL
 - Upvote and downvote movies
 - View a list of movies uploaded
 
# Getting Started

## Prerequisites
 - Node.js
 - npm
 - MongoDB Atlas account
 
## Installation

1. Clone git repository
```
https://github.com/syytruong/youtube-video-sharer.git
```

2. Navigate to the project folder:
```
youtube-video-sharer
```

3. Install the required dependencies for the backend:
```
cd server
npm install
```

4. Install the required dependencies for the frontend:
```
cd ../client
npm install
```

5. Create a .env file in the server folder with the following content:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

## Running the Application

1. Start the backend server:
```
cd server
npm run start
```

2. Start the frontend application:
```
cd client
npm run start
```

3. Open your browser and navigate to http://localhost:3000.

## Built With
 - React
 - Express
 - Node.js
 - MongoDB
 - Mongoose
 - Material-UI
 - Axios
 - bcryptjs
 - jsonwebtoken
 - Jest

## License
This project is licensed under the MIT License.
