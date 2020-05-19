const express = require('express')
const app = express()
const path = require('path')
var jwt = require('jsonwebtoken')
var request = require('request')
var mysql = require('mysql')

app.set('views', path.join(__dirname, 'views')); //ejs의 view파일이 어디에 있는지 알려줌
app.set('view engine', 'ejs'); // ejs라는 템플릿엔진이 파일을 읽어오는 디렉토리로 선정하는 구문

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

app.use(express.json());  
app.use(express.urlencoded({extended:false}));  //express 에서 json을 보내는걸 허용하겠다

var connection = mysql.createConnection({
    host : 'fintech.c3hayok504vf.ap-northeast-2.rds.amazonaws.com',
    user : 'fintech',
    password : '1q2w3e4r!',
    database : 'innodb'
})

connection.connect();
console.log('연결성공!')

app.get('/', function (req, res) {
    var title = "javascript"
    res.send('<html><h1>'+title+'</h1><h2>contents</h2></html>')
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/signup', function(req, res){
    res.render('signup')
})
app.get('/qrcode', function(req,res){
    res.render('qrcode')
})

app.get('/qr', function(req, res){
    res.render('qrReader')
})

app.get('/deposit', function(req, res){
    res.render('deposit');
})

app.get('/withdraw', function(req, res){
    res.render('withdraw');
})

// service start!!!!!!!!!!!!!!!
app.post('/signup', function(req, res){
    //data req get db store
    var visitorEmail = req.body.visitorEmail
    var visitorName = req.body.visitorName
    var visitorPassword = req.body.visitorPassword
    var AccessToken = req.body.AccessToken
    var RefreshToken = req.body.RefreshToken
    var userSeqNo = req.body.userSeqNo

    console.log(visitorEmail, AccessToken, userSeqNo);

    var sql = "INSERT INTO innodb.Visitor (visitorEmail, visitorname, visitorpassword, accesstoken, refreshtoken, userseqno) values (?, ?, ?, ?, ?, ?)";
    connection.query(sql, 
        [visitorEmail, visitorName, visitorPassword, AccessToken, RefreshToken, userSeqNo],
    function(err, result){
        if(err){
            console.log(err);
            res.json(0);
            throw err;
        }
        else{
            res.json(1)
        }
    })
})

app.post('/login', function(req, res){
    var visitorEmail = req.body.visitorEmail;
    var visitorPassword = req.body.visitorPassword;
    var sql = "SELECT * FROM innodb.Visitor WHERE visitoremail = ?";
    connection.query(sql, [visitorEmail], function(err, result){
        if(err){
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            if(result.length == 0){
                res.json(3)
            }
            else {
                var dbPassword = result[0].visitorpassword;
                if(dbPassword == visitorPassword){
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                    jwt.sign(
                      {
                          visitorId : result[0].visitorid,
                          visitorEmail : result[0].visitoremail
                      },
                      tokenKey,
                      {
                          expiresIn : '10d',
                          issuer : 'fintech.admin',
                          subject : 'user.login.info'
                      },
                      function(err, token){
                          console.log('로그인 성공', token)
                          res.json(token)
                      }
                    )            
                }
                else {
                    res.json(2);
                }
            }
        }
    })
})


app.listen(3000);