//routes//home.js

var express = require('express');
var router = express.Router(); //express.Router()를 사용해서 router함수를 초기화합니다.

// Home 
router.get('/',function(req,res){// "/"에 get 요청이 오는 경우 : /contacts로 redirect하는 코드
    res.redirect('/contacts');
});

module.exports = router; //module.exports에 담긴 object(여기서는 router object)가 module이 되어 require시에 사용