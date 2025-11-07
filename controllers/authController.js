import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authController = {
  async signup(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
      });

      await user.save();

      const token = generateToken(user);
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check role if admin login
      if (role && user.role !== role && user.role === 'user') {
        return res.status(403).json({ message: 'Invalid role for this account' });
      }

      const token = generateToken(user);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'Profile retrieved',
        user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, phone, location, bio, skills } = req.body;
      const updates = {};

      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (location) updates.location = location;
      if (bio) updates.bio = bio;
      if (skills) updates.skills = skills;

      updates.updatedAt = new Date();

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
      res.status(200).json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async logout(req, res) {
    res.status(200).json({ message: 'Logout successful' });
  },
};
