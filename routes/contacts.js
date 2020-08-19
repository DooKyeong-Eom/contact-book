//routes/contacts.js

var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact'); // contact.js에는 Contact module을 require로 호출

//Contact - Index 
// "/contacts"에 get 요청이 오는 경우: 에러가 있다면 에러를 json형태로 웹브라우저에 표시하고, 
// 에러가 없다면 검색 결과를 받아 view/contacts/index.ejs를 render(페이지를 동적으로 제작)합니다.
router.get('/',function(req,res){
    Contact.find({},function(err,contacts){
        if(err) return res.json(err);
        res.render('contacts/index',{contacts:contacts});
    });
});

//Contact - New 
// "contacts/new"에 get요청이 오는 경우: 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render합니다.
router.get('/new', function(req,res){
    res.render('contacts/new');
});

//Contact - create 
// "/contacts"에 post 요청이 오는 경우: "/contacts/new"에서 폼을 전달받는 경우입니다.
router.post('/', function(req, res){
    Contact.create(req.body,function(err,contact){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//Contact - show 
// "contacts/:id"에 get요청이 오는 경우: :id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣게 됩니다.
router.get('/:id',function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return res.json(err);
        res.render('contacts/show', {contact:contact});
    });
});

//Contact - edit 
//"contacts/:id/edit"에 get요청이 오는경우: 검색결과를 받아 views/contacts/edit.ejs를 render합니다.
router.get('/:id/edit',function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return res.json(err);
        res.render('contacts/edit',{contact:contact});
    });
});

//Contact - update 
//"contacts/:id"에 put요청이 오는 경우 : Data 수정 후 "/contacts/"+req.params.id로 redirect합니다.
router.put('/:id',function(req,res){
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});

//Contact - destroy 
// Data 삭제 후 "/contacts"로 redirect합니다.
router.delete('/:id',function(req,res){
    Contact.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

module.exports = router;