//models/Contact.js

var mongoose = require('mongoose');

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

module.exports = Contact;