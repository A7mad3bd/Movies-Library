'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT;

const datajson = require('./Movie data/data.json');


const server = express();
server.use(cors());


 server.get('/',handleHomePage);
 server.get('/favorite', handelfavorite) 
server.get('*',handelNotFound);
server.get('*',handelerror);



function Movie (id, title, release_date, vote_average, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.overview = overview;
}  

function handleHomePage(request, response) {
    let Movie1 = new Movie (datajson.id,datajson.title,  datajson.release_date,datajson.vote_average, datajson.overview);
    
    return response.status(200).json(Movie1);
 } 


function handelNotFound(req,res){
    res.status(404).send('page not found error :/ ')
 }



 function handelerror(error,request,response){
    
   return response.status(500).send("Sorry, something went wrong")
   
 }
 

 function handelfavorite(req,res){
    return res.status(200).send("Welcome to Favorite Page");
}
 

server.listen(3000, ()=>{
    console.log("listinig to port 3000");
});





