const express=require("express");
const jwt = require("jsonwebtoken");
const secretKey="secretKey";
const cron = require('node-cron');
const fs=require("fs");

app=express();

app.post("/users", (req, resp) => {
    jwt.sign({},secretKey, { expiresIn: '3000s' }, (err, token) => {   
        resp.json({          
            token
            })
    });
});

app.post("/validate-user",verifyToken,(req,resp)=>{     // this is api
    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err)
        {
            resp.send({result:"Token is invalid"});
        }
        else{
            resp.send({message:"Token is Valid"
            });
            }
        })
});  


function verifyToken(req,resp,next){
      const bearerHeader=req.headers['authorization'];
      if(typeof bearerHeader !=='undefined'){
           const bearer=bearerHeader.split(" ");
           const token=bearer[1];
           req.token=token;
           next();  //This function takes the command to the profile api
           }
      else{
        resp.send({
            result:"Token is not valid"
        })
      }
      next();
}

cron.schedule("* * * * *",function()
{
    let data=`${new Date().toUTCString()}
          : server is working\n`;

    fs.appendFile("logs.txt",data,function(err)
        {
            if(err) throw err;

            console.log("Status Logged!");
        });
});

// app.get("/", (req, resp) => {
//     resp.json({
//         message: "sample api"
//     });
// });
app.listen(5100);