# Game Review API Prototype

## Setup Instructions

1. Ensure Node.js (>=20.10.0) is installed.
2. Initialize packages: `npm install`
3. Run the development server (auto-restarts): `npm run dev`
   - Alternatively: `npm start`
4. The API will start on `http://localhost:3001` and will automatically seed 20 realistic game records to `games.db`.

## Documentation
The API documentation has been generated using APIDOC. You can find the resulting site in the `../apidoc` directory.

To regenerate documentation: `npm run docs`

## Testing (Postman)
You can test these endpoints immediately via Postman using the exported collection file in the root folder, or manually:
- **GET** `/api/games` - Retrieve all.
- **GET** `/api/games/:id` - Retrieve one.
- **POST** `/api/games` - Add JSON payload (title, genre, platform, rating, review).
- **PUT** `/api/games/:id` - Update an existing review.
- **DELETE** `/api/games/:id` - Delete a review.
