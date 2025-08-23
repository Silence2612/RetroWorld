const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory only
app.use(express.static(path.join(__dirname, 'public')));

// Get all HTML games from the Games/HTML directory
const gamesDir = path.join(__dirname, 'Games', 'HTML');
const games = fs.readdirSync(gamesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => {
        const gameName = file.replace('.html', '');
        return {
            id: gameName,
            title: gameName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            description: `A classic ${gameName} game with retro graphics and gameplay.`,
            image: `/images/${gameName}.png`,
            htmlFile: file
        };
    });

// Routes
app.get('/', (req, res) => {
    res.render('home', { games });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/game/:id', (req, res) => {
    const game = games.find(g => g.id === req.params.id);
    if (!game) {
        return res.status(404).render('404');
    }
    res.render('game', { game });
});

// Serve game content for iframes
app.get('/game-content/:id', (req, res) => {
    const game = games.find(g => g.id === req.params.id);
    if (!game) {
        return res.status(404).send('Game not found');
    }
    res.sendFile(path.join(__dirname, 'Games', 'HTML', game.htmlFile));
});

// 404 error handler (must be last)
app.get('/404' , (req, res) => {
    res.render('404'); // Assumes you have views/404.ejs
});

// Serve game content from the Games directory
app.use('/Games', express.static(path.join(__dirname, 'Games')));

// 404 error handler middleware (must be last)
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
