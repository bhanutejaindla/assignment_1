const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ token });
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};

// Upload assignment
const uploadAssignment = async (req, res) => {
  const { task, admin } = req.body;

  const adminExists = await User.findById(admin);
  if (!adminExists || adminExists.role !== 'admin') {
    return res.status(400).json({ message: 'Invalid admin' });
  }

  const assignment = await Assignment.create({
    userId: req.user._id,
    task,
    admin,
  });

  res.status(201).json(assignment);
};

// Get all admins
const getAdmins = async (req, res) => {
  const admins = await User.find({ role: 'admin' }).select('name email');
  res.json(admins);
};

module.exports = { registerUser, loginUser, uploadAssignment, getAdmins };
