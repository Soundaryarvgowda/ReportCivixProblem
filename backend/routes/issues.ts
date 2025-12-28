import express from 'express';
import { Issue } from '../models/Issue';

const router = express.Router();

// Report Issue
router.post('/', async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (error) {
        console.error('Report issue error:', error);
        res.status(500).json({ message: 'Error reporting issue' });
    }
});

// Get Issues (with filters)
router.get('/', async (req, res) => {
    try {
        const { userId, wardNumber, status } = req.query;
        const filter: any = {};

        if (userId) filter.userId = userId;
        if (wardNumber) filter.wardNumber = wardNumber;
        if (status) filter.status = status;

        const issues = await Issue.find(filter).sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({ message: 'Error fetching issues' });
    }
});

// Accept Issue
router.patch('/:id/accept', async (req, res) => {
    try {
        const { corporatorId } = req.body;
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            {
                status: 'accepted',
                assignedCorporator: corporatorId,
                acceptedAt: new Date()
            },
            { new: true }
        );
        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting issue' });
    }
});

// Resolve Issue
router.patch('/:id/resolve', async (req, res) => {
    try {
        const { workReport, resolvedPhoto, resolvedLocation } = req.body;
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            {
                status: 'resolved',
                workReport,
                resolvedPhoto,
                resolvedLocation,
                resolvedAt: new Date()
            },
            { new: true }
        );
        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving issue' });
    }
});

// Escalate Issue
router.patch('/:id/escalate', async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status: 'escalated' },
            { new: true }
        );
        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Error escalating issue' });
    }
});

export default router;
