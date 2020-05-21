const express = require('express')
const app = express()
const path = require('path')
var jwt = require('jsonwebtoken')
var request = require('request')
var auth=require('./lib/auth')
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

app.get('/main', function(req, res){
    res.render('main');
})

app.get('/roomstatus', function(req, res){
    res.render('roomstatus');
})

app.get('/result', function(req, res){
    res.render('result')
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

app.post('/list', auth, function(req, res){
    //계좌 리스트
    var visitorId = req.decoded.visitorId; //token에서 분석해서 가져오기 <decoded>

    var sql = "SELECT * FROM innodb.Visitor WHERE visitorid = ?"
    connection.query(sql, [visitorId], function(err, result){
        if(err){
            console.error(err);
            throw err
        }
        else{
            console.log(result);
    var option = {
        method: "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers : {
            Authorization : 'Bearer' + result[0].accesstoken
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwMDM0ODU1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1OTcxMzExMjQsImp0aSI6ImE2ZTQ3YTE4LTNmNDYtNDUwNS05ZTY4LWUzNjM0NWM3NGVkNiJ9.mG7SJK8xwm_VUB9OSNYkJDx0yOZrx5gZaxzppHBSVg4'
        },
        qs:{
            user_seq_no : result[0].userseqno
        }
    }
    request(option, function(err, response, body){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.json(accessRequestResult) // render 안해

        }
    })
}
})

})

// app.post('/deposit', auth, function (req, res) {
//     var visitorId = req.decoded.visitorId;
//     var fin_use_num = req.body.fin_use_num;

//     var countnum = Math.floor(Math.random() * 1000000000) + 1;
//     var transId = "T991599190U" + countnum; //이용기과번호 본인것 입력

//     var sql = "SELECT * FROM Visitor WHERE visitorid = ?"
//     connection.query(sql,[visitorId], function(err , result){
//         if(err){
//             console.error(err);
//             throw err
//         }
//         else {
//             console.log(result);
//             var option = {
//                 method : "POST",
//                 url : " https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
//                 headers : {
//                     Authorization : 'Bearer ' + result[0].accesstoken,
//                     "Content-Type" : "application/json"
//                 },
//                 json : {
//                     "cntr_account_type":"N", 
//                     "cntr_account_num":"0193294433", 
//                     "wd_pass_phrase":"NONE", 
//                     "wd_print_content":"환불금액", 
//                     "name_check_option":"on",
//                     "tran_dtime":"20200512101921",
//                     "req_cnt":"1",
//                     "req_list":[
//                         {
//                         "tran_no": "1",
//                         "bank_tran_id":transId,
//                         "fintech_use_num":fin_use_num,
//                         "print_content":"오픈서비스캐시백",
//                         "tran_amt":"45000",
//                         "req_client_name":"김민지",
//                         "req_client_bank_code":"097",
//                         "req_client_account_num":"0193294433",
//                         "req_client_num":"HONGGILDONG1234",
//                         "transfer_purpose":"TR"
//                         }
//                     ] 
//                 }
//             }
//             request(option, function(err, response, body){
//                 if(err){
//                     console.error(err);
//                     throw err;
//                 }
//                 else {
//                     console.log(body);
//                     if(body.rsp_code == 'A0000'){
//                         res.json(1)
//                     }
//                 }
//             })
//         }
//     })
// })

// app.post('/withdraw', auth, function (req, res) {
//     var visitorId = req.decoded.visitorId;
//     var fin_use_num = req.body.fin_use_num;

//     var countnum = Math.floor(Math.random() * 1000000000) + 1;
//     var transId = "T991629130U" + countnum; //이용기과번호 본인것 입력

//     var sql = "SELECT * FROM innob.Visitor WHERE visitorid = ?"
//     connection.query(sql,[visitorId], function(err , result){
//         if(err){
//             console.error(err);
//             throw err
//         }
//         else {
//             console.log(result);
//             var option = {
//                 method : "POST",
//                 url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
//                 headers : {
//                     Authorization : 'Bearer ' + result[0].accesstoken,
//                     "Content-Type" : "application/json"
//                 },
//                 json : {
//                     "bank_tran_id": "T991629130U000000004", 
//                     "cntr_account_type": "N",
//                     "cntr_account_num": "7259011638", 
//                     "dps_print_content": "코인노래방 충전", 
//                     "fintech_use_num": "199162913057883975745276", 
//                     "wd_print_content": "코인노래방",
//                     "tran_amt": "1000",
//                     "tran_dtime": "20200421104220", 
//                     "req_client_name": "김민지",
//                     "req_client_bank_code": "097", 
//                     "req_client_account_num": "0193294433",
//                     "req_client_num":"HONGGILDONG1234",
//                     "transfer_purpose":"TR",
//                     "recv_client_name": "노래방업주1", 
//                     "recv_client_bank_code": "097", 
//                     "recv_client_account_num": "7259011638"
//                     }
//             }
//             console.log(option.json.tran_amt);
//             request(option, function(err, response, body){
//                 // 디비에 들어갈 바디 정보 변수 선언 
//                 //var amount = req.body.amount
                
//                 //var tran_dtime = req.body.trand_dtime;
//                 var tran_amt = req.body.tran_amt;
                
//                 var sql2 = "INSERT INTO innodb.Profit(date, profit, clientid) VALUES (curdate(), ?, 1)"
//                 if(err){
//                       console.error(err);
//                       throw err;
//                   }
//                   else {
//                       console.log(body);
//                       if(body.rsp_code == 'A0000'){
//                           res.json(1)
//                           //sql 값 디비에 저장 
//                           connection.query(sql2, [tran_amt] ,function(err, result){
                             
//                             if(err){
//                               console.error(err);
//                               res.json(0);
//                               throw err;
//                             }
//                             else {
//                               res.json(1);
//                             }
//                           })
//                       }
//                   }
//               })
//           }
//       })
//     })

app.post('/withdraw', function(req, res){
  
    var profit = req.body.profit
    console.log(profit);

    var sql2 = "INSERT INTO innodb.Profit(date, profit, clientid, flag) VALUES (curdate(), ?, 1, 0)"
  
  
    connection.query(sql2, [profit] ,function(err, result){
                           
      if(err){
        console.error(err);
        res.json(0);
        throw err;
      }
      else {
        res.json(1);
        console.log("good")
      }
    })
  })
  
  app.post('/result', function(req, res){
  
    var profitId = req.body.profitId
    console.log(profit);

    var sql2 = "select profit from profit where profitid = ?"
  
  
    connection.query(sql2, [profitId] ,function(err, result){
                           
      if(err){
        console.error(err);
        res.json(0);
        throw err;
      }
      else {
        res.json(1);
        console.log("good")
      }
    })
  })

app.listen(3000);