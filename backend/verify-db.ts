
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Issue } from './models/Issue';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

console.log('Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        console.log('\n--- USERS ---');
        const users = await User.find({});
        if (users.length === 0) console.log('No users found.');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.role}) - ${u.contact} [ID: ${u._id}]`);
        });

        console.log('\n--- ISSUES ---');
        const issues = await Issue.find({});
        if (issues.length === 0) console.log('No issues found.');
        issues.forEach(i => {
            console.log(`- ${i.type}: ${i.description.substring(0, 50)}... [Status: ${i.status}] (Reported by: ${i.userName})`);
        });

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
