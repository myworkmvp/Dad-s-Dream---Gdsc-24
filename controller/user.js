const { compare } = require("bcryptjs");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const { error } = require("console");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:null,
    database:"gdsc",
    port:"3306"
});

exports.Needfood =(req,res,next)=>{
    db.query("select * from Coins",(error,result)=>{
        if(error){
            console.log(error);
        }
        req.user = result;
        return next();  
    })
}



exports.Prov_food = async (req,res)=>{
    const {username,email,phone,food_type,message,location} = req.body;
   // console.log(phone);
    var dt = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toJSON().slice(0,19).replace('T',' ');
    db.query("select Email from user_details where Email=?",[email],(error,result)=>{
        if(error)console.log(error);
        if(result.length<=0){
            return res.render("food_prov",{msg:"Email not exist"});
        }else{
            db.query("insert into Coins(Username,Email,Phone,Food_type,Message,Location,Coin_type,Coin,Date) values(?,?,?,?,?,?,'give',100,?);",[username,email,phone,food_type,message,location,dt],(error,result)=>{
                if(error){
                    console.log(error);
                }
                db.query("select Coin from user_details where Email = ?;",[email],(error,cin)=>{
                    if(error){
                        console.log(error);
                    }
                    console.log(cin[0].Coin);
                    var coin = cin[0].Coin;
                    coin = coin+100;
                    console.log(coin);
                    db.query("update user_details set Coin=? where Email = ?;",[coin,email],(error,res)=>{
                        if(error){
                            console.log(error);
                        }
                       // console.log(res);
                    })  
                   // console.log(cin.Coin);
                })  
               // console.log(result);
                return res.redirect("/food");
            })  
        }
    });
    
}

exports.fullUsers=(req,res,next)=>{
    db.query("select * from user_details order by Coin desc",(err,res)=>{
        if(err) console.log(err);
        else{
        req.fullUser = res;
        return next();
        }
    })
}

exports.Login=(req,res)=>{
    try{
        const {email,password}= req.body;
        db.query("select * from user_details where Email=?",[email],(error,result)=>{
            if(error)console.log(error);
            
            if(result.length<=0){
                return res.render("index",{msg:"Account not exist"});
            }
            else {
                if(result[0].Password === password){
                    const Id = result[0].Id;
                    const token = jwt.sign({id:Id},process.env.JWT_SECRET,
                        {expiresIn:process.env.JWT_EXPRIE}
                        );
                    console.log("TOKEN CREATED SUCCESSFULLY");
                    const cookiesOption = {
                        expires: new Date(
                            Date.now()+process.env.JWT_COOKIE * 24 * 60 * 60 * 1000   
                        ),
                        httpOnly: true,
                    };
                    res.cookie("gdsc",token,cookiesOption);
                    res.status(200).redirect("/food");
                }else{
                    return res.render("index",{msg:"Password Incorrect"});
                }
            }
        })
    }catch(error){
        console.log(error)
    }
};

exports.Register=(req,res) =>{
    const {username,email,password}= req.body;
    db.query("select Email from user_details where Email=?",[email],(error,result)=>{
        if(error){
            console.log(error);
        }
        if(result.length >0){
           return res.render("signin",{msg:"Email already Registered"});
        }
        db.query("insert into user_details set ?",{Username:username,Email:email,Password:password},(error,result)=>{
            if(error) console.log(error);
            else{
                res.render("signup",{msg:"successfully register"});
            }
        });
    })  
};


exports.isLogined = async(req,res,next)=>{
    if(req.cookies.gdsc){
        try{
            const decode = await promisify(jwt.verify)(req.cookies.gdsc,process.env.JWT_SECRET);
            db.query("select * from user_details where Id=?",[decode.id],(err,results)=>{
                if(!results){
                    return next();
                }
                /*
                db.query("select sum(Coin) as fullcoin from Coins where Email=?",[results[0].Email],(err,C)=>{
                        if(err) console.log(err);
                        let res= results[0];
                        let cin= C[0];
                        let jn= Object.assign(res,cin);
                        req.user = jn;
                        return next();
                })    */  
                db.query("select Coin from user_details where Email=?",[results[0].Email],(err,res)=>{
                    if(err)console.log(err);
                        let r= results[0];
                        let cin= res;
                        let jn= Object.assign(r,cin);
                        req.user = jn;
                        return next();  
                })
                
            })
        }catch(error){
            console.log(error);
        }
    }
}

