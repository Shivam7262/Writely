# Writely

Writely is a full-stack collaborative document editor web application. It allows users to register, log in, and create, edit, and manage documents in real time. The project is built with a React frontend and a Node.js/Express/MongoDB backend.

## Features
- User registration and authentication (JWT-based)
- Create, edit, and delete documents
- Real-time collaboration (if enabled)
- Responsive and modern UI with React and Tailwind CSS
- Secure password storage and validation

## Folder Structure
```
Writely/
├── client/      # React frontend
├── server/      # Node.js/Express backend
└── README.md    # Project documentation
```

### Client (Frontend)
- Built with React, TypeScript, and Tailwind CSS
- Handles user interface, authentication, and document editing
- Located in the `client/` directory

### Server (Backend)
- Built with Node.js, Express, and MongoDB (via Mongoose)
- Handles authentication, document APIs, and JWT token management
- Located in the `server/` directory

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Shivam7262/Writely.git
   cd Writely
   ```

2. **Backend setup:**
   ```sh
   cd server
   npm install
   # Create a .env file with the following variables:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # JWT_EXPIRE=30d
   # PORT=5000 (optional)
   npm start
   ```

3. **Frontend setup:**
   ```sh
   cd ../client
   npm install
   npm start
   # The app will run at http://localhost:3000
   ```

## Usage
- Register a new account or log in with existing credentials
- Create, edit, and manage your documents
- (Optional) Collaborate in real time if enabled

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the MIT License. 