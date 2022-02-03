'use strict';
const datajson = require('./Movie data/data.json');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
// DATABASE_URL=postgres://username:password@localhost:5432/databaseName

const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;

const server = express();
server.use(cors());
server.use(express.json()); // whenever you read from the body please parse it to a json format 

server.get('/', handleHomePage);
server.get('/favorite', handelfavorite)
server.get('/trending', trendingHandler);
server.get('/changes', ChangesgHandler);
server.get('/certification', certificationHandler);
server.get('/search', searchgHandler);

 server.post('/addMovie', addMovie);
server.get('/getMovies', getMovies);


server.use('*',notFoundHandler);
server.use(errorHandler)

function Movie1(id, title, release_date, vote_average, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.overview = overview;
}

// let userSearch = "The Sahwshank"; // an input from the user 
let url1 = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
let url2 = `https://api.themoviedb.org/3/movie/changes?api_key=${process.env.APIKEY}&page=1`
let url3 = `https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.APIKEY}`


function handleHomePage(req,res){
    res.status(200).send("Welcome :) ");
}

function trendingHandler(req,res){
    let newArr = [];
    axios.get(url1)
     .then((result)=>{
        result.data.results.forEach(Movie =>{
            newArr.push(new Movie1(Movie.id, Movie.title, Movie.release_date, Movie.vote_average, Movie.overview));
    })
        res.status(200).json(newArr);

    }).catch((err)=>{
        errorHandler(err,req,res);
    })
}

function searchgHandler(req,res){
    let newArr = [];

    let userSearch = req.query.userSearch;
    console.log(userSearch);

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}`;

    axios.get(url)
    .then(result=>{
        let Movies=result.data.results.forEach(Movie => {
            newArr.push(new Movie1(Movie.id, Movie.title, Movie.release_date, Movie.vote_average, Movie.overview));
        });
        res.status(200).json(newArr);  
     }).catch(err=>{
        errorHandler(err,req,res);
    })
}


function ChangesgHandler(req, res) {
    let newArr = [];
    axios.get(url2).then((result) => {

        res.status(200).json(result.data);

    }).catch((err) => {
        errorHandler(err,req,res);
    })
}


function certificationHandler(req, res) {
    let newArr = [];
    axios.get(url3).then((result) => {

        res.status(200).json(result.data);

    }).catch((err) => {

    })
}


function addMovie(req,res){
  const mov = req.body;
let sql = `INSERT INTO myfavmovietable( title, release_date, vote_average, overview) VALUES ($1,$2,$3,$4) RETURNING *;`
let values=[mov.title,mov.release_date,mov.vote_average,mov.overview];
client.query(sql,values).then(data =>{
      res.status(200).json(data.rows);
  }).catch(error=>{
      errorHandler(error,req,res)
  });
}


function getMovies(req,res){
    let sql = `SELECT * FROM myfavmovietable;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}




function handelfavorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}


function notFoundHandler(req,res){
   res.status(404).send("This page is not found")
}

function errorHandler (error,req,res){
   const err = {
        status : 500,
        messgae : error
    }
    res.status(500).send(err);
}


client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})

