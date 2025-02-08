const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const socketIo = require("socket.io");  // This imports the socket.io library
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const validator = require('validator');
const fs = require('fs');
const morgan = require('morgan'); // For request logging
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const { exec } = require('child_process');
const User = require('./models/User'); // Ensure path correctness
const Admin = require('./models/Admin'); // Ensure path correctness
const Question = require('./models/Question');
const MCQQuestion = require('./models/mcqQuestion');
require('dotenv').config();

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Clustering: Improve performance by using multiple workers
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process running, forking ${numCPUs} workers...`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });

} else {
  const app = express();
  const server = http.createServer(app);


 // Initialize Socket.io with CORS settings
 const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});


 // CORS Middleware
 app.use(cors({
  origin: FRONTEND_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());  // For parsing incoming JSON requests
app.use(helmet());  // Security middleware to set various HTTP headers
app.use(morgan('dev'));  // Logs HTTP requests for easier debugging



// Increase server timeout settings to prevent connection issues
server.keepAliveTimeout = 120000;  // 120 seconds
server.headersTimeout = 120000;  // 120 seconds


// Define the ACTIONS object
const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  JOIN_ROOM: "join-room",
  LEAVE: "leave"
};


// A map to track users and their socket IDs
const userSocketMap = {}; // User to socket ID map


function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on(ACTIONS.JOIN_ROOM, ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });
});


// Real-Time for socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for text updates from the client
  socket.on('textChange', (newText) => {
    console.log('Text received:', newText);

    // Broadcast the updated text to all other clients
    socket.broadcast.emit('textUpdate', newText);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/EditMantra')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

mongoose.connect('mongodb+srv://vikashvks037:Vikash%40123@cluster0.ljjpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Route for basic API health check
app.get("/", (req, res) => {
  res.send("EditMantra API is running 🚀");
});

  // User logging
app.post('/user-login', async (req, res) => {
  const { email, password } = req.body; // User login does not require key

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'User login successful',
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during user login' });
  }
});


//Admin logging
app.post('/admin-login', async (req, res) => {
  const { email, password, key } = req.body; // Admin login requires key

  if (!email || !password || !key) {
    return res.status(400).json({ message: 'Email, password, and admin key are required' });
  }

  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    if (user.key !== key) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Admin login successful',
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});
  

// Route to /signup/user
app.post('/signup/user', async (req, res) => {
  const { name, email, username, password } = req.body;

  // Validate input
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
    });
  }

  try {
    const [existingUser, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});


// Admin Sign Up Route
app.post('/signup/admin', async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
    });
  }

  try {
    const [existingAdmin, existingUsername] = await Promise.all([
      Admin.findOne({ email }),
      Admin.findOne({ username })
    ]);

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    console.error('Error during admin signup:', error.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});


// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Assuming you have a User model connected to a database
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load users' });
  }
});


// Route to update user details by ID
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { stars, review, feedback } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { stars, review, feedback },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});


// Route to fetch Admin profile
app.get('/api/admin/profile', async (req, res) => { // Add the leading `/` in the path
  try {
    // Fetching admin data from the database
    const admin = await Admin.findOne(); // Assuming you have a single admin record
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin); // Send the admin data as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin info', error: err.message });
  }
});


// Route to fetch user profile
app.get('/api/user/profile', async (req, res) => {
  try {
    // Fetch the first user (if there is only one, or modify as needed)
    const user = await User.findOne(); // Fetch a single user, or modify if you want to fetch based on some condition

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send the user data as response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user info', error: err.message });
  }
});


// Route to add a question
app.post('/api/questions/add', async (req, res) => {
  const { title, description, difficulty } = req.body;

  if (!title || !description || !difficulty) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const newQuestion = new Question({
      title,
      description,
      difficulty,
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully!' });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Failed to add question. Please try again.' });
  }
});


// Route to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id); // Find the user by ID and delete
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});


// Route to fetch all questions
app.get('/api/questions', async (req, res) => {
  try {
    // Assuming you have a 'Question' model that also stores challenge information
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions.' });
  }
});


//Fetch question by ID
app.get('/api/questions/:id', async (req, res) => {
  const questionId = req.params.id;

  try {
      // Validate the format of the ID
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
          return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Fetch the question from the database
      const question = await Question.findById(questionId);

      // Check if the question exists
      if (!question) {
          return res.status(404).json({ error: 'Question not found' });
      }

      // Respond with the question data
      res.json({ question });
  } catch (error) {
      // Log the error for debugging
      console.error(`Error fetching question with ID ${questionId}:`, error);

      // Respond with a generic error message
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Verify Username Route
app.post('/verify-username', async (req, res) => {
  const { username } = req.body;

  try {
    // Check if username exists in User or Admin schemas
    const user = await User.findOne({ username });
    const admin = await Admin.findOne({ username });

    if (user || admin) {
      return res.status(200).json({ message: 'Username verified successfully' });
    } else {
      return res.status(404).json({ message: 'Username not found' });
    }
  } catch (error) {
    console.error('Error verifying username:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/compile', (req, res) => {
  const { code, lang, input } = req.body;

  if (!code || !lang) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const fileName = `temp.${lang}`;
  const inputData = input || '';

  // Save the code to a temporary file
  fs.writeFileSync(fileName, code);

  let command = '';
  switch (lang) {
    case 'python':
      command = `python ${fileName}`;
      break;
    case 'javascript':
      // Execute JavaScript code with Node.js
      command = `node ${fileName}`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported language' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ stderr: error.message });
    }

    if (stderr) {
      return res.status(500).json({ stderr });
    }

    res.json({ stdout, stderr, compile_output: 'Compilation successful', status: 'completed' });
  });
});


//Add Question (Admin Only)
app.post('/api/admin/add-question', async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const newQuestion = new MCQQuestion({
      question,
      options,
      correctAnswer,
    });
    await newQuestion.save();
    res.status(201).send({ message: 'Question added successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error adding question', error: err });
  }
});


// Get All Questions (User)
app.get('/api/mcqquestions', async (req, res) => {
  try {
    const questions = await MCQQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching questions', error: err });
  }
});

 // Start Server
 server.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
});
};