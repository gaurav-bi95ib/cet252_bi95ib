const API_URL = 'http://localhost:3001/api/games';

// DOM Elements
const form = document.getElementById('game-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const gamesGrid = document.getElementById('games-grid');

// Form Inputs
const idInput = document.getElementById('game-id');
const titleInput = document.getElementById('title');
const genreInput = document.getElementById('genre');
const platformInput = document.getElementById('platform');
const ratingInput = document.getElementById('rating');
const reviewInput = document.getElementById('review');

// Load games on initial render
document.addEventListener('DOMContentLoaded', fetchGames);

// Fetch all games
async function fetchGames() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderGames(data.games);
    } catch (error) {
        console.error('Error fetching games:', error);
        gamesGrid.innerHTML = '<p style="color: var(--danger-color)">Error loading games. Please ensure the API is running.</p>';
    }
}

// Render games into the grid
function renderGames(games) {
    gamesGrid.innerHTML = '';
    
    // Reverse to show newest first
    games.slice().reverse().forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <h3 class="game-title">${escapeHTML(game.title)}</h3>
            <div class="game-meta">
                <span class="badge">${escapeHTML(game.genre)}</span>
                <span class="badge">${escapeHTML(game.platform)}</span>
                <span class="badge rating-badge">⭐ ${game.rating}/10</span>
            </div>
            <p class="game-review">${escapeHTML(game.review)}</p>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editGame(${game.id})" data-testid="edit-btn-${game.id}">Edit</button>
                <button class="btn btn-danger" onclick="deleteGame(${game.id})" data-testid="delete-btn-${game.id}">Delete</button>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}

// Form Submit Handler (Works for Create and Update)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gameData = {
        title: titleInput.value.trim(),
        genre: genreInput.value.trim(),
        platform: platformInput.value.trim(),
        rating: parseInt(ratingInput.value),
        review: reviewInput.value.trim()
    };

    const id = idInput.value;

    try {
        if (id) {
            // Update mode
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });
        } else {
            // Create mode
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });
        }
        
        resetForm();
        fetchGames();
    } catch (error) {
        console.error('Error saving game:', error);
        alert('Failed to save the review. Check console.');
    }
});

// Edit Game (Populate form)
async function editGame(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        const game = data.game;

        idInput.value = game.id;
        titleInput.value = game.title;
        genreInput.value = game.genre;
        platformInput.value = game.platform;
        ratingInput.value = game.rating;
        reviewInput.value = game.review;

        // Change UI state
        formTitle.textContent = "Edit Game Review";
        submitBtn.textContent = "Update Review";
        cancelBtn.classList.remove('hidden');
        
        // Scroll to form smoothly
        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

// Delete Game
async function deleteGame(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchGames();
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    }
}

// Handle Cancel Button
cancelBtn.addEventListener('click', resetForm);

// Reset Form State
function resetForm() {
    form.reset();
    idInput.value = '';
    formTitle.textContent = "Add New Game Review";
    submitBtn.textContent = "Save Review";
    cancelBtn.classList.add('hidden');
}

// Basic security sanitization
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}
