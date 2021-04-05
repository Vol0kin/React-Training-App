const app = require('../app');

const port = process.env.PORT || 8080;

app.set('port', port);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

