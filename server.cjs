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

app.get('/orders', cors(), (request, res) => {
  con.execute('SELECT * from orders WHERE orderId = ?', [request.query.orderId], (_, result) => {
    res.send(JSON.stringify({ result }));
  });
});

app.get('/returnorders', cors(), (request, res) => {
  con.execute('UPDATE orders SET isReturned = TRUE WHERE orderId = ?', [request.query.orderId]);
});

app.get('/failedconversations', cors(), (request, res) => {});

app.listen(port, () => {
  console.log(`Server started, listening on port ${port}`);
});
