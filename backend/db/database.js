const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const syncInit = () => {
  const adapter = new FileSync(path.join(__dirname, 'posts.json'));
  const db = low(adapter);

  db.defaults({
    posts: []
  }).write();

  return db;
}

const db = syncInit();

console.log(db.get('posts').value());

module.exports = db;


