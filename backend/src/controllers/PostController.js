const schema = require('../models/postSchema.json');
const db = require('../db/database');
const _ = require('lodash');
const createError = require('http-errors');

const Ajv = require('ajv');

class PostController {
  constructor(db) {
    this.db = db;
    this.schema = schema;
    this.validator = new Ajv();
  }

  getPost(id) {
    const post = this.db.get('posts')
      .find({ 'id': id })
      .value();

    if (!post) {
      throw createError(404, 'Post does not exist');
    }

    return post;
  }

  getPostsByUserId(userId) {
    const posts = this.db.get('posts')
      .filter({ 'userId': userId })
      .value();

    if (_.isEmpty(posts)) {
      throw createError(404, 'Post does not exist');
    }

    return posts;
  }

  getAllPosts() {
    const posts = this.db.get('posts').value();
    
    return posts;
  }

  addPost(postInfo) {
    const latestPost = this.db.get('posts')
      .maxBy('id')
      .value();

    const nextId = latestPost.id + 1;
    const post = {id: nextId, ...postInfo};

    const validPost = this.validator.validate(this.schema, post);

    if (!validPost) {
      throw createError(400, "Bad request: the petition's body is not valid");
    } else {
      this.db.get('posts').push(post).write();
    }

    return post;
  }

  deletePost(id) {
    const post = this.db.get('posts')
      .find({ 'id': id })
      .value();

    if (post) {
      this.db.get('posts').remove(post).write();
    } else {
      throw createError(404, 'Post does not exist');
    }
  }

  updatePost(updatedPost) {
    const validPost = this.validator.validate(this.schema, updatedPost);

    if (!validPost) {
      throw createError(400, 'Bad request: wrong fields specified');
    } else {
      const { id } = updatedPost;

      const post = this.db.get('posts')
        .find({ 'id': id })
        .value();

      if (post) {
        this.db.get('posts').find(post).assign(updatedPost).write();
      } else {
        throw createError(404, 'Post does not exist');
      }
    }
  }
};

module.exports = PostController;

