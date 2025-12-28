import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { contact, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ contact });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Return user without password
        const userResponse = savedUser.toObject();
        // @ts-ignore
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { contact, password } = req.body;

        // Find user
        const user = await User.findOne({ contact });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Return user without password
        const userResponse = user.toObject();
        // @ts-ignore
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

export default router;
