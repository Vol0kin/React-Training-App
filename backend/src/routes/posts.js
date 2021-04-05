const express = require('express');
const PostController = require('../controllers/PostController');
const db = require('../db/database');
const transformFieldToNumber = require('../utils/transformFieldToNumber');

const router = express.Router();

const postController = new PostController(db);

router.get('/', (req, res) => {
  const posts = postController.getAllPosts();

  const userIdFilter = transformFieldToNumber(req.query.userId);
  const idFilter = transformFieldToNumber(req.query.id);
  const titleFilter = req.query.title;
  const bodyFilter = req.query.body;

  let filteredPosts = [...posts];

  // Filtering logic
  if (userIdFilter) {
    filteredPosts = filteredPosts.filter(({ userId }) => userId === userIdFilter);
  }

  if (idFilter) {
    filteredPosts = filteredPosts.filter(({ id }) => id === idFilter);
  }

  if (titleFilter) {
    filteredPosts = filteredPosts.filter(({ title }) => title.includes(titleFilter));
  }

  if (bodyFilter) {
    filteredPosts = filteredPosts.filter(({ body }) => body.includes(bodyFilter));
  }

  res.status(200).contentType('application/json').send(filteredPosts);
});

router.get('/:id', (req, res, next) => {
  const id = transformFieldToNumber(req.params.id);
  let post;

  try {
    post = postController.getPost(id);
  } catch (error) {
    next(error);
    return;
  }

  res.status(200).contentType('application/json').send(post);
});

router.put('/', (req, res, next) => {
  const userId = transformFieldToNumber(req.body.userId);

  let responsePost;
  const postInfo = {
    userId,
    title: req.body.title,
    body: req.body.body
  }

  try {
    responsePost = postController.addPost(postInfo);
  } catch (error) {
    next(error);
    return;
  }

  res.status(200).contentType('application/json').send(responsePost);
});

router.post('/:id', (req, res, next) => {
  const id = transformFieldToNumber(req.params.id);
  const userId = transformFieldToNumber(req.body.userId);

  const post = {
    id,
    userId,
    title: req.body.title,
    body: req.body.body
  };

  try {
    postController.updatePost(post);
  } catch (error) {
    next(error);
    return;
  }

  res.status(200).contentType('application/json').send(post);
});

router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    postController.deletePost(id);
  } catch (error) {
    next(error);
    return;
  }

  res.status(200).contentType('application/json')
    .send({"message": "Deleted post"});
});

module.exports = router;

