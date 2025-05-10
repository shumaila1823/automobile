const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('./workshop.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                service TEXT NOT NULL,
                date TEXT NOT NULL
            )
        `);
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/api/book', (req, res) => {
    const { name, email, phone, service, date } = req.body;
    db.run(
        `INSERT INTO bookings (name, email, phone, service, date) VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, service, date],
        (err) => {
            if (err) {
                res.status(500).send('Error saving booking.');
            } else {
                res.status(200).send('Booking saved successfully!');
            }
        }
    );
});

app.get('/api/bookings', (req, res) => {
    db.all(`SELECT * FROM bookings`, [], (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching bookings.');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});