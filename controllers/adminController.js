const Assignment = require('../models/assignmentModel');
const User = require('../models/userModel');

// Register a new admin
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await User.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, password: hashedPassword, role: 'admin' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ token });
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin || admin.role !== 'admin') return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};

// Get assignments for the admin
const getAssignments = async (req, res) => {
  const assignments = await Assignment.find({ admin: req.user._id }).populate('userId', 'name').sort({ createdAt: -1 });
  res.json(assignments);
};

// Accept assignment
const acceptAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment || assignment.admin.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  assignment.status = 'accepted';
  await assignment.save();

  res.json({ message: 'Assignment accepted' });
};

// Reject assignment
const rejectAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment || assignment.admin.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  assignment.status = 'rejected';
  await assignment.save();

  res.json({ message: 'Assignment rejected' });
};

module.exports = { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment };
