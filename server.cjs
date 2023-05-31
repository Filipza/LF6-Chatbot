const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
const port = 3000;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'change-me',
  database: 'test',
});

con.connect();

app.get('/', cors(), (_, res) => {
  con.query('SELECT * from users', (_, result) => {
    res.send(JSON.stringify({ result }));
  });
});

app.listen(port, () => {
  console.log(`Server started, listening on port ${port}`);
});
