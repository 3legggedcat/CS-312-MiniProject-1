import express from 'express';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts'; 

const app = express();
const port = 3000;

// Set up EJS and layout engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary storage for blog posts
let posts = [];

// Homepage route - Display form and posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Handle form submission to create a new post
app.post('/new-post', (req, res) => {
    const post = {
        id: posts.length + 1, // Assign a unique ID
        name: req.body.name,
        title: req.body.title,
        body: req.body.body,
        time: new Date().toLocaleString(), // Creation time
    };
    posts.push(post); // Add post to the array
    res.redirect('/'); // Redirect back to the homepage
});

// Route to edit a post (GET the post data)
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render('edit', { post });
    } else {
        res.send('Post not found');
    }
});

// Handle editing the post (POST updated data)
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].body = req.body.body;
        res.redirect('/');
    } else {
        res.send('Post not found');
    }
});

// Handle deleting a post
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
