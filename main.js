var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

db.defaults({tasks: []})
  .write()

//routes
app.get('/',function(req,res){
    todolist = db.get('tasks').value()
    res.render('index.ejs', {todoList: todolist});
});

//CREATE
app.post('/create', function(req, res){
    var item = req.body.item;

    try{
        db.get('tasks')
        .push({id: shortid.generate(), title: item})
        .write()

        res.redirect('/');
    
    }catch(err){
        throw err;
    }
    
});

//READ
app.get('/show/:id', function(req,res){
    const task = db.get('tasks')
    .find({id: req.params.id}).value()

    res.render('show.ejs', {todo: task});
});

//UPDATE
app.post('/update/:id' , function(req, res){
    var id = req.params.id;
    var item = req.body.item;

    try{
        db.get('tasks')
        .find({id: id})
        .assign({title: item})
        .write()

        res.redirect('/');
    }catch(err){
        throw(err);
    }
});

//DELETE
app.post('/delete/:id', function(req, res){
    var id = req.params.id;
    try{
        db.get('tasks')
        .remove({id: id})
        .write()

        res.redirect('/')

    }catch(err){
        throw(err);
    }
});

app.get('*', function(req,res){
    res.send(`<h1>Invalid Page</h1>`);
});

app.listen(3000, function(){
    console.log("running at localhost:3000");
});

