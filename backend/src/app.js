const express = require('express');
const posts = require('./routes/posts');

const app = express();

app.use(express.json());

app.use('/posts', posts);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status).contentType('application/json')
    .send({"message": err.message});
});

module.exports = app;

