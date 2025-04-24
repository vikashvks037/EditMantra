const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const socketIo = require("socket.io");  // This imports the socket.io library
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require("node-fetch"); // Ensure node-fetch is installed
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const morgan = require('morgan'); // For request logging
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User'); // Ensure path correctness
const Admin = require('./models/Admin'); // Ensure path correctness
const Question = require('./models/Question');
const MCQQuestion = require('./models/mcqQuestion');
const aiRoutes = require('./routes/ai.routes');
const { PythonShell } = require('python-shell');



const app = express();


// Create an HTTP server using Express
const server = http.createServer(app);


const PORT = process.env.PORT || 5000;


// // Initialize Socket.io with CORS configuration
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your client-side URL
//     methods: ["GET", "POST"]
//   }
// });

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from the frontend (adjust this URL if needed)
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
// }));


// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "https://editmantra-coding-and-learning.onrender.com", // Replace with your client-side URL
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://editmantra-coding-and-learning.onrender.com', // Allow requests from the frontend (adjust this URL if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));


// MongoDB connection 
mongoose.connect('mongodb+srv://vikashvks037:Vikash%40123@cluster0.ljjpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// // MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/EditMantra')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json());  // For parsing incoming JSON requests
app.use(helmet());  // Security middleware to set various HTTP headers
app.use(morgan('dev'));  // Logs HTTP requests for easier debugging
app.use('/ai', aiRoutes)


// Rate Limiting: Limiting requests to avoid abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Max 100 requests per window per IP
});
app.use(limiter);

const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  JOIN_ROOM: "join-room",
  LEAVE: "leave",
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

const JWT_SECRET = 'your_secret_key';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];  // Extract token from 'Bearer token'
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user;  // Attach user info from the token to the request
    next();
  });
};

// Route for basic API health check
app.get("/", (req, res) => {
  res.send("EditMantra API is running 🚀");
});

// User login with JWT
app.post('/user-login', async (req, res) => {
  const { email, password } = req.body;

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

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'User login successful',
      token,
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



// User Signup with JWT
app.post('/signup/user', async (req, res) => {
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
    const [existingUser, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
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

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ message: 'User registered successfully!', token });
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
  const { stars, points, feedback } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { stars, points , feedback },
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


// Route to fetch user profile (Authenticated user access)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  const { userId } = req.user; // Assuming userId is stored in the JWT payload

  try {
    const user = await User.findById(userId); // Fetch the user based on the ID from the JWT payload

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send the user data as response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user info', error: err.message });
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


// Route to fetch books by title
app.get("/api/books", async (req, res) => {
  const searchTerm = req.query.title;
  if (!searchTerm) {
      return res.status(400).json({ error: "Title parameter is required" });
  }

  try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${searchTerm}`);
      if (!response.ok) {
          throw new Error(`OpenLibrary API error: ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
  }
});

// ✅ New Route to fetch book details by ID
app.get("/api/book/:id", async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
  }

  try {
      const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
      if (!response.ok) {
          throw new Error(`OpenLibrary API error: ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error("Error fetching book details:", error);
      res.status(500).json({ error: "Failed to fetch book details" });
  }
});


// Route to add a question
app.post('/api/questions/add', async (req, res) => {
  const { title, description, difficulty, testCases } = req.body;

  if (!title || !description || !difficulty) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const newQuestion = new Question({
      title,
      description,
      difficulty,
      testCases: Array.isArray(testCases) ? testCases.map(tc => ({
        input: isNaN(tc.input) ? tc.input : Number(tc.input),  // Convert to number if possible
        expectedOutput: isNaN(tc.expectedOutput) ? tc.expectedOutput : Number(tc.expectedOutput),
      })) : []
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully!', question: newQuestion });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Failed to add question. Please try again.' });
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


// Compiler code 
const fs = require("fs/promises"); // ✅ Fix: Import fs/promises for async file handling
const { spawn } = require("child_process");

app.post("/compile", async (req, res) => {
  const { code, lang, questionId } = req.body;

  if (!code || !lang || !questionId) {
    return res.status(400).json({ error: "Code, language, and question ID are required" });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    let testCaseResults = [];
    let passedTestCases = 0;
    let tempFilePath = lang === "python" ? "temp_code.py" : "Main.java";

    // ✅ Save code to a temporary file
    await fs.writeFile(tempFilePath, code, "utf8");

    // 🔹 If Java, compile first
    if (lang === "java") {
      await new Promise((resolve, reject) => {
        const compileProcess = spawn("javac", [tempFilePath]); // Compile Java
        compileProcess.on("close", (code) => {
          if (code !== 0) reject("Java compilation failed.");
          else resolve();
        });
      });
    }

    for (const testCase of question.testCases) {
      let command, args;

      if (lang === "python") {
        command = "python";
        args = [tempFilePath];
      } else if (lang === "java") {
        command = "java";
        args = ["Main"];
      } else {
        return res.status(400).json({ error: "Unsupported language" });
      }

      const process = spawn(command, args);

      process.stdin.write(testCase.input + "\n"); // Pass input via stdin
      process.stdin.end();

      let output = "";
      process.stdout.on("data", (data) => {
        output += data.toString().trim();
      });

      await new Promise((resolve) => process.on("close", resolve));

      console.log("Test Case Input:", testCase.input);
      console.log("Expected Output:", testCase.expectedOutput);
      console.log("Actual Output:", output);

      let passed = output === String(testCase.expectedOutput).trim();
      testCaseResults.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: output,
        passed,
      });

      if (passed) passedTestCases++;
      if (passedTestCases >= 2) break; // Stop early if two test cases pass
    }

    // ✅ Clean up files
    await fs.unlink(tempFilePath).catch(() => {}); 
    if (lang === "java") await fs.unlink("Main.class").catch(() => {}); // Delete compiled Java class

    // ✅ Return result
    if (passedTestCases >= 2) {
      const submission = new CodeSubmission({ code, lang, output: "Test cases passed", questionId });
      await submission.save();
      return res.json({ message: "✅ Code passed test cases and stored in DB.", status: "success", testCaseResults });
    }

    res.json({ message: "❌ Code failed test cases.", status: "fail", testCaseResults });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to execute Python code
app.post('/python-collaboration', (req, res) => {
  const { code } = req.body;

  // Use PythonShell to execute the Python code
  PythonShell.runString(code, null, function (err, result) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ output: result.join('\n') }); // Return the output from the Python code execution
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
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
