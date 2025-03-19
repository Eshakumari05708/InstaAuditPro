// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Fake Instagram API simulation (for demo)
app.post('/api/audit', async (req, res) => {
    const { username } = req.body;
    try {
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
        // Simulated data
        const data = {
            username: username,
            followers: Math.floor(Math.random() * 10000),
            following: Math.floor(Math.random() * 1000),
            posts: Math.floor(Math.random() * 500),
            engagementRate: (Math.random() * 5 + 1).toFixed(2) + '%',
            profilePic: "https://ui-avatars.com/api/?name=" + username
        };
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
