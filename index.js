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

//#region DB Schema 
// mongoose.Schema 함수로 DB에서 사용할 schema를 설정, 데이터베이스에 정보를 어떠한 형식으로 저장할건지 지정해주는 부분
var contactSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String},
    phone:{type:String}
});


var Contact = mongoose.model('contact',contactSchema);  // mongoose.model 함수를 사용하여 contact schema의 model을 생성
                                                        // 첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름
                                                        // 두번째 parameter는 mongoose.Schema로 생성된 오브젝트, DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact 변수에 연결
                                                        // 생성된 Contact object는 mongoDB의 contact collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있음
//#endregion


//Routes

// Home 
// "/"에 get 요청이 오는 경우 : /contacts로 redirect하는 코드
app.get('/',function(req,res){
    res.redirect('/contacts');
});

//Contact - Index 
// "/contacts"에 get 요청이 오는 경우: 에러가 있다면 에러를 json형태로 웹브라우저에 표시하고, 
// 에러가 없다면 검색 결과를 받아 view/contacts/index.ejs를 render(페이지를 동적으로 제작)합니다.
app.get('/contacts',function(req,res){
    Contact.find({},function(err,contacts){
        if(err) return res.json(err);
        res.render('contacts/index',{contacts:contacts});
    });
});

//Contact - New 
// "contacts/new"에 get요청이 오는 경우: 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render합니다.
app.get('/contacts/new', function(req,res){
    res.render('contacts/new');
});

//Contact - create 
// "/contacts"에 post 요청이 오는 경우: "/contacts/new"에서 폼을 전달받는 경우입니다.
app.post('/contacts', function(req, res){
    Contact.create(req.body,function(err,contact){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//Contact - show 
// "contacts/:id"에 get요청이 오는 경우: :id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣게 됩니다.
app.get('/contacts/:id',function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return res.json(err);
        res.render('contacts/show', {contact:contact});
    });
});

//Contact - edit 
//"contacts/:id/edit"에 get요청이 오는경우: 검색결과를 받아 views/contacts/edit.ejs를 render합니다.
app.get('/contacts/:id/edit',function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return res.json(err);
        res.render('contacts/edit',{contact:contact});
    });
});

//Contact - update 
//"contacts/:id"에 put요청이 오는 경우 : Data 수정 후 "/contacts/"+req.params.id로 redirect합니다.
app.put('/contacts/:id',function(req,res){
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});

//Contact - destroy 
// Data 삭제 후 "/contacts"로 redirect합니다.
app.delete('/contacts/:id',function(req,res){
    Contact.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});



//#region Port setting
var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:'+port);
});

//#endregion