const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; 

const userSchemea = mongoose.Schema({
    name:{
        type:String,
        maxlength : 50
    },
    email:{
        type : String,
        trim: true,
        unique:1
    },
    password:{
        type:String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default : 0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp : {
        type:Number
    }
    
});

userSchemea.methods.comparePassword = function(plainPassword, func){
    //비밀번호 비교,
    bcrypt.compare(plainPassword, this.password, (err, isMatch)=>{
        
        if(err) return func(err);
        else{
            func(null, isMatch);
        }
    });

}//스키마에는 사용자 정의 메소드/함수를 붙일 수 있다.
userSchemea.methods.makeToken=function(func){
    //jwt이용
    //let user = this;
    let token = jwt.sign(this._id.toHexString(),'tokens')//user._id;
    this.token=token;//user.token = token
    this.save((err)=>{//user.save((err,user)=>)
        if(err) return func(err);
        func(null,this);//this가 index.js에 있는 makeToken의 매개변수중 user로 가게됨
        //func(null,user);
    });
}
userSchemea.pre('save',function(next){
    //비밀번호 암호화

    let user = this;
    if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err);
        else{
        bcrypt.hash(user.password, salt, function(err,hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    }

    });
}
else{
    next();
}});

userSchemea.statics.findByToken = function(token, callback) {
    let user = this;
    jwt.verify(token,'tokens',function(err,decoded){
        user.findOne({"_id":decoded,"token":token},function(err,user){
            if (err)return cb(err);
            callback(null,user);
        })
    })
}

const User = mongoose.model('User',userSchemea);

module.exports={User};