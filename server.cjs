const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
const port = 3000;

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'changeme',
  database: 'chatbot',
});

con.connect();

app.get('/orders', cors(), (_, res) => {
  con.query('SELECT * from orders', (_, result) => {
    res.send(JSON.stringify({ result }));
  });
});

app.listen(port, () => {
  console.log(`Server started, listening on port ${port}`);
});
