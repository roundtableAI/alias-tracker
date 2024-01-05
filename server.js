const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the Heroku-provided port or 3000 locally

// Serve static files (e.g., HTML, JavaScript) from a public directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});