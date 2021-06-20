const mongoose = require('mongoose');
const key = require('../config/key');
const express = require('express');
const app = express();
let router = express.Router();
const dbData = require("./post");
const {auth} = require('../middleware/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));//application/www-~~
app.use(bodyParser.json());//application/json
app.use(cookieParser())

mongoose.connect(key.mongoURL,{
  useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log("MongoDB successfully connected...")
).catch(err => console.log(err));





app.post('/user/register',(req,res)=>{
  const user = new User(req.body);
  
  user.save((err,doc)=>{
    //console.log(err);
    if(err) return res.json({success: false, err});
    return res.status(200).json({
      success: true
    });
  });
});

app.post('/user/login',(req, res)=>{
  
  //1.요청된 email을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email}, (err,info)=>{
    
    if(!info){
      return res.json({
        login:false,
        message:"Email is not found"
      });
      
    }
      //2.email이 데이터 베이스에 존재한다면, 비밀번호가 같은지 확인
      else{
        info.comparePassword(req.body.password, (err, isMatch)=>{
          
              if(!isMatch) return res.json({
                login:false,
                message:"Password is wrong"
              });
              //3.비밀번호도 일치한다면 토큰을 생성한다.
              else{
                  info.makeToken((err, user)=>{
                      console.log(err)
                      if(err) return res.status(400).send(err);
                      //토큰을 저장한다, 어디에? => cookie혹은 로컬 스토리지 등등에
                      else{
                        res.cookie("x_auth", user.token).status(200).json({login:true, userId : user._id});
                        
                      }
                      
                      
                    });
                  }
                })
              }
            });
          });
          

          
          app.get('/user/auth',auth,(req,res)=>{
            res.status(200).json({
              _id : req.user._id,
              isAdmin : req.user.role === 0 ? false : true,
              isAuth:true,
              email:req.user.email,
              name:req.user.name,
              lastname:req.user.lastname,
              role:req.user.role,
              image:req.user.image
            })
          });
          
          app.get('/user/logout',auth,(req,res)=>{
            User.findOneAndUpdate({_id:req.user._id},{
              token:""},(err,user)=>{
                if(err) return res.json({success:false, err});
                return res.status(200).send({
                  success:true
                })
              }
  )
});

router.get('/', function(req, res){  
  dbData.find({},(err, info)=>{
    console.log(info)
    res.send(info);
  })
  //console.log(User);

});


module.exports = router;





