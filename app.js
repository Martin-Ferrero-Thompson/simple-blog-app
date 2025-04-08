const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// In-memory storage for posts (no database)
let posts = [];
let postIdCounter = 1; // Simple counter for unique IDs

// --- Middleware ---
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Specify the directory where EJS templates are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files (like CSS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---

// GET /: Display all posts and the creation form
app.get('/', (req, res) => {
    // Render index.ejs, passing the current posts array
    res.render('index', { posts: posts });
});

// POST /posts: Handle creation of a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        const newPost = {
            id: postIdCounter++, // Assign a unique ID and increment the counter
            title: title,
            content: content
        };
        posts.push(newPost); // Add the new post to our in-memory array
    }
    res.redirect('/'); // Redirect back to the home page
});

// GET /posts/edit/:id: Show the edit form for a specific post
app.get('/posts/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10); // Get ID from URL and parse as integer
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.render('edit', { post: post }); // Render the edit view with the post data
    } else {
        res.status(404).send('Post not found'); // Handle case where post doesn't exist
    }
});

// POST /posts/edit/:id: Handle updating a specific post
app.post('/posts/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1 && title && content) {
        // Update the post in the array
        posts[postIndex].title = title;
        posts[postIndex].content = content;
        res.redirect('/'); // Redirect back to home page after editing
    } else if (postIndex === -1) {
        res.status(404).send('Post not found');
    } else {
        // Basic validation feedback (could be improved)
        res.redirect(`/posts/edit/${postId}?error=Missing title or content`);
    }
});

// POST /posts/delete/:id: Handle deleting a specific post
app.post('/posts/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    // Filter out the post with the matching ID
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/'); // Redirect back to the home page
});


// --- Server Start ---
app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`);
});