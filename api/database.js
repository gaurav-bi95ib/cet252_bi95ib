const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to SQLite database.');
        
        // Initialize the table and populate it
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                platform TEXT NOT NULL,
                rating INTEGER CHECK(rating >= 1 AND rating <= 10),
                review TEXT NOT NULL
            )`);

            // Seed with 20 records if table is empty
            db.get("SELECT COUNT(*) AS count FROM games", (err, row) => {
                if (row && row.count === 0) {
                    console.log('Seeding initial database records...');
                    const stmt = db.prepare("INSERT INTO games (title, genre, platform, rating, review) VALUES (?, ?, ?, ?, ?)");
                    
                    const mockGames = [
                        ['The Legend of Zelda', 'Adventure', 'Nintendo Switch', 10, 'A breathtaking open-world masterpiece.'],
                        ['Elden Ring', 'RPG', 'PC', 10, 'Incredible world design and challenging combat.'],
                        ['Cyberpunk 2077', 'RPG', 'PS5', 8, 'Great story but still has a few bugs.'],
                        ['Hollow Knight', 'Metroidvania', 'PC', 9, 'Atmospheric and incredibly refined gameplay.'],
                        ['Minecraft', 'Sandbox', 'Multiplatform', 10, 'Endless creativity and fun.'],
                        ['Stardew Valley', 'Simulation', 'PC', 9, 'Relaxing farming and relationship building.'],
                        ['Celeste', 'Platformer', 'Nintendo Switch', 10, 'Perfect platforming mechanics.'],
                        ['Super Mario Odyssey', 'Platformer', 'Nintendo Switch', 9, 'A joyous celebration of 3D Mario.'],
                        ['Red Dead Redemption 2', 'Action', 'PS4', 10, 'Unmatched storytelling and detail.'],
                        ['God of War', 'Action', 'PS4', 9, 'Epic combat and a gripping narrative.'],
                        ['Persona 5 Royal', 'JRPG', 'PS4', 9, 'Stylish, deep, and heavily engaging.'],
                        ['Bloodborne', 'Action RPG', 'PS4', 9, 'Victorian gothic masterpiece.'],
                        ['Hades', 'Roguelite', 'PC', 10, 'Addictive loop and great characters.'],
                        ['Terraria', 'Sandbox', 'PC', 9, '2D Minecraft but with more combat focus.'],
                        ['DOOM Eternal', 'FPS', 'PC', 9, 'Fast, frantic, and incredibly satisfying.'],
                        ['Spider-Man', 'Action', 'PS4', 8, 'The best web-swinging game ever made.'],
                        ['Half-Life: Alyx', 'VR', 'PC', 10, 'The killer app for VR.'],
                        ['Resident Evil 4 Remake', 'Survival Horror', 'PS5', 9, 'Perfect modernization of a classic.'],
                        ['Final Fantasy VII Remake', 'RPG', 'PS4', 8, 'A visual treat with great combat.'],
                        ['Portal 2', 'Puzzle', 'PC', 10, 'Brilliant puzzles and hilarious writing.']
                    ];

                    for (const game of mockGames) {
                        stmt.run(game);
                    }
                    stmt.finalize();
                    console.log('Database seeded with 20 records.');
                }
            });
        });
    }
});

module.exports = db;
