const express=require('express');
const cors = require('cors');
var sqlString=require('sqlstring');

var mysql = require('mysql');
const app = express();
const PORT =8080;

app.use(express.json());
app.use(cors(
));

app.listen(
    PORT,
    () => console.log(`Hello World, ${PORT}`)
)

var con = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database:""
  })

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");




app.get('/rest/person', (req,res) =>{ //run this when Url is called
        var sql ='SELECT * FROM person;';
        console.log('Ping');

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.status(200).send(
                {
                 result,
            })
          });

      });
});

app.get('/rest/transaction', (req,res) =>{ //run this when Url is called
    var sql ='SELECT * FROM transaction;';


    con.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).send(
            {
             result,
        })
      });

  });

app.get('/rest/ping', (req,res) =>{ //run this when Url is called
    console.log('Ping');
    res.status(200).send({
        message:'pong'

    })
});

app.get(`/rest/person/:name`, (req,res) =>{ //run this when Url is called
    console.log('Pong');
    var {name} = req.params; // get from headers/param
    console.log(req.params);

  /*  if(name.includes(`'` )){
        message="Invalid SQL";
        res.status(500).send;
        return null;
    }*/
    name= sanitize(name);
    //console.log(name);


        var sql =`SELECT * FROM person t where t.first_name like '%`+name+`%' or t.last_name like '%`+name+`%';`;

        con.query(sql, function (err, result) {
            if (err){
                res.status(500).send;
                con.end();
                throw err
            }
            res.status(200).send({
                 result,
            })
    });
});


app.post('/rest/login', (req,res) =>
{
        console.log(req.body);
        var u  = req.body.user;
        var p = req.body.password;
        console.log(u+" "+p);
        var key=generate().toString();
        console.log(typeof(key));

        var token={"login_token":key};


        var sql =`SELECT * FROM person t where t.first_name like '%`+u+`%';`;

        con.query(sql, function (err, result) {
            console.log(result.length)

            if(result.length === 0){
                return res.sendStatus(500);
            }
            if (err){
                res.sendStatus(500);
                con.end();
                throw err
            }
            if(u==result[0].first_name.toLowerCase() && p==result[0].password)
            {
            res.status(200).send({
                token
            })

            var id=result[0].id;
            var date=Date.now()

            var sqlIn=`INSERT INTO token (token,created_at,expires,id) VALUES('`+key+`','`+date+`','`+date+`','`+id+`');`;

            con.query(sqlIn, function (err, result) {
                console.log("Successfully added token")     ;
                if (err){
                    throw err
                }
            });


        }
        else{
            res.status(500).send;
        }
        
    });

});

app.post('/rest/create',(req,res)=>{
        var id,fname, lname,email,dob;

        if(req.body.id =="" || req.body.id == null){
            id=Date.now();
            console.log(id);
        }
        else{ 
            id=req.body.id;
        }
        
        fname = req.body.fname;
        lname = req.body.lname;
        email= req.body.email.toString();
        dob=req.body.dob;

        var sql=`INSERT INTO person (id,first_name,last_name,email,DOB) VALUES('`+id+`','`+fname+`','`+lname+`','`+email+`','`+dob+`');`; //needs to be an insert

        con.query(sql, function (err, result) {
            if (err){
                res.status(500).send;
                //con.end();
                throw err;
            }

            res.status(201).send({ })
    });


       // res.status(201).send({});
});


function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

function  generate(){ //might be good to array this for looping
var num=['A','B','C','D','E','F','G','H',1,2,3,4,5,6,7,8,9,0]
var key='';
for(var i=0;i<=18;i++){

    if(i+1 % 5 == 0){ // i+1 give me the true location
    key+='-';
    }
    else{
    
    var o=Math.floor(Math.random() * num.length);
    var p =num[o];
    key+=p;
    }
}
console.log(key);
return key.toString();
}