const express = require('express')
const app = express()
const path = require('path')
var request = require('request')

app.set('views', path.join(__dirname, 'views')); //ejs의 view파일이 어디에 있는지 알려줌
app.set('view engine', 'ejs'); // ejs라는 템플릿엔진이 파일을 읽어오는 디렉토리로 선정하는 구문

app.use(express.json());  
app.use(express.urlencoded({extended:false}));  //express 에서 json을 보내는걸 허용하겠다

app.get('/', function (req, res) {
    var title = "javascript"
    res.send('<html><h1>'+title+'</h1><h2>contents</h2></html>')
})

app.listen(3000);