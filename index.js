const express = require("express");
const mysql = require("mysql");
const bodyParser = require( "body-parser" );
const morgan = require("morgan");
const app = express();

app.use ( bodyParser.json() );
app.use ( bodyParser.urlencoded({ extended: true }) );

app.use (express.static ( "public" ));

//Middleware
app.use(morgan("dev"));

var con  = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "navgurukul",
    database : "mydatabase"
});

con.connect((err)=>{
    if (err) throw err;
    console.log("connected");
});

let createtable = "create table if not exists todos(id int primary key auto_increment, name varchar(200), description varchar(100))";
con.query(createtable,(err,result)=>{
    if (err) throw err;
    console.log("table created");
});

//To get all todos
app.get("/getalltodos",(req,res)=>{
    con.query("select * from todos",(err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//To get todos by id
app.get("/gettodosbyid/:id",(req,res)=>{
    let id = req.params.id;
    con.query("select * from todos where id = ?",[id],(err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//To insert new todos
app.post("/newtodo",(req,res)=>{
    let name = req.body.name;
    let description = req.body.description;
    con.query("insert into todos (name,description) values (?,?)",[name,description],(err,result)=>{
        if (err) throw err;
        res.send("your todo inserted");
    })
})

//update todo
app.put("/updatetodo/:id",(req,res)=>{
    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description;
    con.query("update todos set name = ?, description = ? where id = ?",[name, description, id],(err,result)=>{
        if (err) throw err;
        res.send("your todo updated successfully");
    });
});

//To delete todo
app.delete("/deletetodo/:id",(req,res)=>{
    let id = req.params.id;
    con.query("delete from todos where id = ?",[id], (err,result)=>{
        if (err) throw err;
        var affected = result.affectedRows
        if (affected===0){
            res.send("your todo is wrong")
        }else{
            res.send("your todo deleted successfully")
        };
    });
});

//Localhost
app.listen (9900);
console.log ("Listining");