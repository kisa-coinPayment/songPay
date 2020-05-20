const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

//MySQL 연동
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1q2w3e4r',
  database: 'fintech',
});

connection.connect();

// React JS + Node JS 서버 연결
app.use(cors());

//JSON 형식 사용
app.use(bodyParser.json());

// app.use('/api', (req, res) => res.json({ username: 'bryan' }));
app.use('/api', (req, res) => {
  var sql =
    'INSERT INTO fintech.user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?,?,?,?,?,?)';
  connection.query(
    sql, // excute sql
    ['bryan', '@@@@@', '21312', 'access', 'refresh', 'seqence'], // ? <- value
    function (err, result) {
      if (err) {
        console.error(err);
        res.json(0);
        throw err;
      } else {
        res.json(1);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
