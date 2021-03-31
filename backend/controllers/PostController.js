const schema = require('../models/postSchema.json');
const db = require('../db/database');
const _ = require('lodash');

const Ajv = require('ajv');
const ajv = new Ajv();

class PostController {
  constructor(db) {
    this.db = db;
    this.validate = ajv.compile(schema);
  }

  getPost(id) {
    const post = this.db.get('posts')
      .find({ 'id': id })
      .value();

    if (!post) {
      throw new Error(404);
    }

    console.log(post);

    return post;
  }

  getPostsByUserId(userId) {
    const posts = this.db.get('posts')
      .filter({ 'userId': userId })
      .value();

    if (_.isEmpty(posts)) {
      throw new Error(404);
    }

    console.log(posts);

    return posts;
  }
};

const controller = new PostController(db);
// controller.getPost(10);
// controller.getPostsByUserId(1);
module.exports = PostController;
