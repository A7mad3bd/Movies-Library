// npm start => start the server 
'use strict';

const express = require('express');
const cors = require('cors');

const data = require('./Movie data/data.json');


const server = express();
server.use(cors());

server.get('/', handelerror ) //http://localhost:3000/
server.get('/favorite', handelfavorite) //http://localhost:3000/favorite
server.get('*',handelNotFound);//http://localhost:3000/** 

function Meme(id,name,image,  tags, topText){
   this.id= id;
   this.name = name;
   this.image=image;
   this.tags = tags;
   this.topText = topText;
}


function handelfavorite(req,res){
    return res.status(200).send("Welcome to Favorite Page");
}


function handelNotFound(req,res){
    res.status(404).send('page not found error :/ ')
 }
 function handelerror(request,response){
    
   return response.status(500).send("Sorry, something went wrong")
   
 }
 

server.listen(3000,()=>{
    console.log("my server is listining to port 3000");
})






