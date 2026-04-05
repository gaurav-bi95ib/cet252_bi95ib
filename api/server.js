const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the Client Application on the root URL (http://localhost:3001)
app.use(express.static(path.join(__dirname, '../client')));

// Serve the generated API Docs on http://localhost:3001/docs
app.use('/docs', express.static(path.join(__dirname, '../apidoc')));

/**
 * @api {get} /api/games Get All Games
 * @apiName GetGames
 * @apiGroup Games
 *
 * @apiSuccess {Object[]} games List of games.
 * @apiSuccess {Number} games.id Unique ID of the game.
 * @apiSuccess {String} games.title Title of the game.
 * @apiSuccess {String} games.genre Genre of the game.
 * @apiSuccess {String} games.platform Gaming platform.
 * @apiSuccess {Number} games.rating Rating out of 10.
 * @apiSuccess {String} games.review Review text.
 */
app.get('/api/games', (req, res) => {
    db.all("SELECT * FROM games", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ games: rows });
    });
});

/**
 * @api {get} /api/games/:id Get a Specific Game
 * @apiName GetGame
 * @apiGroup Games
 *
 * @apiParam {Number} id Game's unique ID.
 *
 * @apiSuccess {Object} game Game details.
 */
app.get('/api/games/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM games WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Game not found" });
        }
        res.json({ game: row });
    });
});

/**
 * @api {post} /api/games Create a New Game Review
 * @apiName CreateGame
 * @apiGroup Games
 *
 * @apiParam {String} title Title of the game.
 * @apiParam {String} genre Genre of the game.
 * @apiParam {String} platform Platform of the game.
 * @apiParam {Number} rating Rating from 1 to 10.
 * @apiParam {String} review Written review.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id Processed ID.
 */
app.post('/api/games', (req, res) => {
    const { title, genre, platform, rating, review } = req.body;
    if (!title || !genre || !platform || !rating || !review) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.run(
        "INSERT INTO games (title, genre, platform, rating, review) VALUES (?, ?, ?, ?, ?)",
        [title, genre, platform, rating, review],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Game review added successfully", id: this.lastID });
        }
    );
});

/**
 * @api {put} /api/games/:id Update a Game Review
 * @apiName UpdateGame
 * @apiGroup Games
 *
 * @apiParam {Number} id Game's unique ID.
 * @apiParam {String} title Title of the game.
 * @apiParam {String} genre Genre of the game.
 * @apiParam {String} platform Platform of the game.
 * @apiParam {Number} rating Rating from 1 to 10.
 * @apiParam {String} review Written review.
 *
 * @apiSuccess {String} message Success message.
 */
app.put('/api/games/:id', (req, res) => {
    const id = req.params.id;
    const { title, genre, platform, rating, review } = req.body;

    db.run(
        "UPDATE games SET title = ?, genre = ?, platform = ?, rating = ?, review = ? WHERE id = ?",
        [title, genre, platform, rating, review, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Game not found" });
            }
            res.json({ message: "Game review updated successfully" });
        }
    );
});

/**
 * @api {delete} /api/games/:id Delete a Game Review
 * @apiName DeleteGame
 * @apiGroup Games
 *
 * @apiParam {Number} id Game's unique ID.
 *
 * @apiSuccess {String} message Success message.
 */
app.delete('/api/games/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM games WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Game not found" });
        }
        res.json({ message: "Game review deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
});
