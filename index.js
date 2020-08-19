//index.js

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // body-parser 모듈을 bodyParser변수에 담기
var methodOverride = require('method-override')// method-override 모듈을 methodOverride변수에 담기
var app = express();

//#region  DB setting 
mongoose.set('useNewUrlParser',true);   // mongoose의 몇몇 글로벌 설정을 해주는 부분, 수정되는 일이 없기 때문에 왠만하면 이렇게 설정 
mongoose.set('useFindAndModify',false);  
mongoose.set('useCreateIndex',true);     
mongoose.set('useUnifiedTopology',true);
mongoose.connect(process.env.MONGO_DB); // node.js에서 기본적으로 제공되는 process.env 오브젝트는 환경변수를 가지고 있는 객체, DB connection string을 환경변수에 저장했기 때문
var db = mongoose.connection;           // mongoose의 db object를 가져와 db변수에 넣는 과정, DB와 관련된 이벤트 리스너 함수들이 있음

db.once('open',function(){              // db가 성공적으로 연결된 경우, DB 연결은 앱이 실행되면 단 한번만 일어나는 이벤트이므로 db.once('이벤트_이름',콜백_함수) 사용
    console.log('DB connected');
});

db.on('error',function(err){            // db 연결 중 에러가 있는 경우, error는 DB접속시 뿐만 아니라, 다양한 경우에 발생할 수 있기 때문에 db.on('이벤트_이름',콜백_함수) 사용
    console.log('DB ERROR : ',err);
});

//#endregion

//#region Other settings
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // bodyParser을 사용하기 위해 필요한 코드들, json형식의 데이터를 받는다는 설정
app.use(bodyParser.urlencoded({extended:true})); // urlencoded data를 extended 알고리즘을 사용해서 분석한다는 설정
app.use(methodOverride('_method')); // _method의 query로 들어오는 값으로 HTTP method를 바꿉니다. 
//#endregion


//Routes
app.use('/',require('./routes/home')); // 해당 route에 요청이 오는 경우메나 콜백함수를 호출
app.use('/contacts',require('./routes/contacts')); // 해당 route에 요청이 오는 경우메나 콜백함수를 호출


//#region Port setting
var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:'+port);
});

//#endregion