const {User} = require('../server/user');
let auth =(req, res,next)=>{//인증처리

  // 클라이언트에서 토큰 가져오기
    let token = req.cookies.x_auth;
  //토큰을 복호화한후 유저를 찾는다.
  User.findByToken(token,(err, user)=>{
    if(err) throw err;
    if(!user) return res.json({IsAuth : false, err:true});

    req.token = token;
    req.user = user;//다른 코드에서 사용할 수 있게 하려고
    next();
  })
  
}
module.exports={auth};